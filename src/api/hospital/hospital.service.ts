import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Hospital, HospitalDocument } from './schemas/hospital.schema'
import { HospitalStaff, HospitalStaffDocument } from './schemas/hospital-staff.schema'
import { CreateHospitalDto } from './dto/create-hospital.dto'
import { UpdateHospitalDto } from './dto/update-hospital.dto'
import { HospitalQueryDto } from './dto/hospital-query.dto'
import { HospitalStatus } from '../../constants/hospital.constant'
import { FindAllResult } from '../../common/dto/pagination/pagination.list.dto'
import { ValidateObjectId } from '../../exceptions/validattion.exception'
import { UserRole } from '../users/user-type/enum/user.enum'
import { CurrentUser } from './interfaces/current-user.interface'
import { BloodInventoryItem } from './interfaces/hospital.interface'

@Injectable()
export class HospitalService {
  constructor(
    @InjectModel(Hospital.name)
    private hospitalModel: Model<HospitalDocument>,
    @InjectModel(HospitalStaff.name)
    private hospitalStaffModel: Model<HospitalStaffDocument>
  ) {}

  async create(createHospitalDto: CreateHospitalDto, currentUser: CurrentUser): Promise<Hospital> {
    try {
      // Only admin can create hospitals
      if (currentUser.role !== UserRole.Admin) {
        throw new ForbiddenException('Only administrators can create hospitals')
      }

      // Check for duplicate hospital name in same district
      const existingHospital = await this.hospitalModel.findOne({
        name: createHospitalDto.name,
        district: createHospitalDto.district,
        isDeleted: false
      })

      if (existingHospital) {
        throw new BadRequestException('Hospital with this name already exists in the district')
      }

      // Validate expiration dates for blood inventory
      if (createHospitalDto.bloodInventory) {
        const now = new Date()
        for (const item of createHospitalDto.bloodInventory) {
          if (new Date(item.expiresAt) <= now) {
            throw new BadRequestException(
              `Blood inventory item expires in the past: ${item.bloodType} ${item.component}`
            )
          }
        }
      }

      const hospital = new this.hospitalModel({
        ...createHospitalDto,
        createdAtBy: {
          _id: currentUser._id,
          email: currentUser.email
        }
      })

      return await hospital.save()
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof ForbiddenException) {
        throw error
      }
      throw new BadRequestException('Failed to create hospital')
    }
  }

  async findAll(query: HospitalQueryDto, currentUser?: CurrentUser): Promise<FindAllResult<Hospital>> {
    try {
      const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', ...filters } = query

      // Build filter conditions
      const conditions: Record<string, unknown> = { isDeleted: false }

      // Public users can only see approved and active hospitals
      if (!currentUser || currentUser.role !== UserRole.Admin) {
        conditions.status = HospitalStatus.APPROVED
        conditions.isActive = true
      }

      // Apply filters
      if (filters.search) {
        conditions.$text = { $search: filters.search }
      }

      if (filters.province) {
        conditions.province = { $regex: filters.province, $options: 'i' }
      }

      if (filters.district) {
        conditions.district = { $regex: filters.district, $options: 'i' }
      }

      if (filters.ward) {
        conditions.ward = { $regex: filters.ward, $options: 'i' }
      }

      if (filters.status && currentUser?.role === UserRole.Admin) {
        conditions.status = filters.status
      }

      if (filters.isActive !== undefined) {
        conditions.isActive = filters.isActive
      }

      // Blood inventory filters
      if (filters.bloodType || filters.component) {
        const bloodConditions: Record<string, unknown> = {}
        if (filters.bloodType) {
          bloodConditions['bloodInventory.bloodType'] = filters.bloodType
        }
        if (filters.component) {
          bloodConditions['bloodInventory.component'] = filters.component
        }
        Object.assign(conditions, bloodConditions)
      }

      // Sorting
      const sort: Record<string, 1 | -1> = {}
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1

      // Execute query with pagination
      const skip = (page - 1) * limit
      const [hospitals, totalItems] = await Promise.all([
        this.hospitalModel.find(conditions).sort(sort).skip(skip).limit(limit).lean().exec(),
        this.hospitalModel.countDocuments(conditions)
      ])

      const totalPages = Math.ceil(totalItems / limit)

      return {
        message: 'Hospitals retrieved successfully',
        data: {
          meta: {
            current: page,
            limit: limit,
            pages: totalPages,
            total: totalItems
          },
          result: hospitals
        }
      }
    } catch {
      throw new BadRequestException('Failed to fetch hospitals')
    }
  }

  async findOne(id: string, currentUser?: CurrentUser): Promise<Hospital> {
    ValidateObjectId(id)

    const conditions: Record<string, unknown> = { _id: id, isDeleted: false }

    // Public users can only see approved and active hospitals
    if (!currentUser || currentUser.role !== UserRole.Admin) {
      conditions.status = HospitalStatus.APPROVED
      conditions.isActive = true
    }

    const hospital = await this.hospitalModel.findOne(conditions).lean().exec()

    if (!hospital) {
      throw new NotFoundException('Hospital not found')
    }

    return hospital
  }

  async update(id: string, updateHospitalDto: UpdateHospitalDto, currentUser: CurrentUser): Promise<Hospital> {
    ValidateObjectId(id)

    // Check permissions
    const canUpdate = await this.checkUpdatePermission(id, currentUser)
    if (!canUpdate) {
      throw new ForbiddenException('You do not have permission to update this hospital')
    }

    // Validate expiration dates for blood inventory
    if (updateHospitalDto.bloodInventory) {
      const now = new Date()
      for (const item of updateHospitalDto.bloodInventory) {
        if (new Date(item.expiresAt) <= now) {
          throw new BadRequestException(`Blood inventory item expires in the past: ${item.bloodType} ${item.component}`)
        }
      }
    }

    const hospital = await this.hospitalModel
      .findOneAndUpdate(
        { _id: id, isDeleted: false },
        {
          ...updateHospitalDto,
          updatedAtBy: {
            _id: currentUser._id,
            email: currentUser.email
          }
        },
        { new: true, runValidators: true }
      )
      .lean()
      .exec()

    if (!hospital) {
      throw new NotFoundException('Hospital not found')
    }

    return hospital
  }

  async remove(id: string, currentUser: CurrentUser): Promise<void> {
    ValidateObjectId(id)

    // Only admin can delete hospitals
    if (currentUser.role !== UserRole.Admin) {
      throw new ForbiddenException('Only administrators can delete hospitals')
    }

    const result = await this.hospitalModel
      .findOneAndUpdate(
        { _id: id, isDeleted: false },
        {
          isDeleted: true,
          isDeletedBy: {
            _id: currentUser._id,
            email: currentUser.email
          }
        }
      )
      .exec()

    if (!result) {
      throw new NotFoundException('Hospital not found')
    }

    // Also soft delete all hospital staff
    await this.hospitalStaffModel.updateMany(
      { hospitalId: id, isDeleted: false },
      {
        isDeleted: true,
        isDeletedBy: {
          _id: currentUser._id,
          email: currentUser.email
        }
      }
    )
  }

  async approve(id: string, currentUser: CurrentUser): Promise<Hospital> {
    ValidateObjectId(id)

    if (currentUser.role !== UserRole.Admin) {
      throw new ForbiddenException('Only administrators can approve hospitals')
    }

    const hospital = await this.hospitalModel
      .findOneAndUpdate(
        { _id: id, isDeleted: false },
        {
          status: HospitalStatus.APPROVED,
          updatedAtBy: {
            _id: currentUser._id,
            email: currentUser.email
          }
        },
        { new: true, runValidators: true }
      )
      .lean()
      .exec()

    if (!hospital) {
      throw new NotFoundException('Hospital not found')
    }

    return hospital
  }

  async reject(id: string, currentUser: CurrentUser): Promise<Hospital> {
    ValidateObjectId(id)

    if (currentUser.role !== UserRole.Admin) {
      throw new ForbiddenException('Only administrators can reject hospitals')
    }

    const hospital = await this.hospitalModel
      .findOneAndUpdate(
        { _id: id, isDeleted: false },
        {
          status: HospitalStatus.REJECTED,
          updatedAtBy: {
            _id: currentUser._id,
            email: currentUser.email
          }
        },
        { new: true, runValidators: true }
      )
      .lean()
      .exec()

    if (!hospital) {
      throw new NotFoundException('Hospital not found')
    }

    return hospital
  }

  async updateBloodInventory(
    id: string,
    bloodInventory: BloodInventoryItem[],
    currentUser: CurrentUser
  ): Promise<Hospital> {
    ValidateObjectId(id)

    // Check permissions
    const canUpdate = await this.checkUpdatePermission(id, currentUser)
    if (!canUpdate) {
      throw new ForbiddenException('You do not have permission to update this hospital blood inventory')
    }

    // Validate expiration dates
    const now = new Date()
    for (const item of bloodInventory) {
      if (new Date(item.expiresAt) <= now) {
        throw new BadRequestException(`Blood inventory item expires in the past: ${item.bloodType} ${item.component}`)
      }
    }

    const hospital = await this.hospitalModel
      .findOneAndUpdate(
        { _id: id, isDeleted: false },
        {
          bloodInventory,
          updatedAtBy: {
            _id: currentUser._id,
            email: currentUser.email
          }
        },
        { new: true, runValidators: true }
      )
      .lean()
      .exec()

    if (!hospital) {
      throw new NotFoundException('Hospital not found')
    }

    return hospital
  }

  async addBloodInventory(id: string, bloodItem: BloodInventoryItem, currentUser: CurrentUser): Promise<Hospital> {
    ValidateObjectId(id)

    // Check permissions
    const canUpdate = await this.checkUpdatePermission(id, currentUser)
    if (!canUpdate) {
      throw new ForbiddenException('You do not have permission to update this hospital blood inventory')
    }

    // Validate expiration date
    if (new Date(bloodItem.expiresAt) <= new Date()) {
      throw new BadRequestException(
        `Blood inventory item expires in the past: ${bloodItem.bloodType} ${bloodItem.component}`
      )
    }

    const hospital = await this.hospitalModel
      .findOneAndUpdate(
        { _id: id, isDeleted: false },
        {
          $push: { bloodInventory: bloodItem },
          updatedAtBy: {
            _id: currentUser._id,
            email: currentUser.email
          }
        },
        { new: true, runValidators: true }
      )
      .lean()
      .exec()

    if (!hospital) {
      throw new NotFoundException('Hospital not found')
    }

    return hospital
  }

  private async checkUpdatePermission(hospitalId: string, currentUser: CurrentUser): Promise<boolean> {
    // Admin can update any hospital
    if (currentUser.role === UserRole.Admin) {
      return true
    }

    // Check if user is hospital admin or staff
    const staff = await this.hospitalStaffModel
      .findOne({
        hospitalId: hospitalId,
        userId: currentUser._id,
        isActive: true,
        isDeleted: false
      })
      .exec()

    return !!staff
  }
}
