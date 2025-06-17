import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Hospital, HospitalDocument } from './schemas/hospital.schema'
import { HospitalStaff, HospitalStaffDocument } from './schemas/hospital-staff.schema'
import { CreateHospitalDto } from './dto/create-hospital.dto'
import { UpdateHospitalDto } from './dto/update-hospital.dto'
import { HospitalQueryDto } from './dto/hospital-query.dto'
import { HospitalStatus } from '../../constants/hospital.constant'
import { ValidateObjectId } from '../../exceptions/validattion.exception'
import { UserRole } from '../users/user-type/enum/user.enum'
import { CurrentUser } from './interfaces/current-user.interface'
import { BloodInventoryItem } from './interfaces/hospital.interface'
import { PaginationUtil } from '../../utils/pagination.util'
import { PageOptionsDto } from '@common/dto/offset-pagination/page-options.dto'

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
      // if (currentUser.role !== UserRole.Admin) {
      //   throw new ForbiddenException('Only administrators can create hospitals')
      // }

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

  async findAll(query: HospitalQueryDto, currentUser?: CurrentUser) {
    const { search, province, district, ward, status, isActive, bloodType, component, ...reqDto } = query

    // Build filter conditions
    const filter: Record<string, unknown> = { isDeleted: false }

    // Public users can only see ACTIVE and active hospitals
    // if (!currentUser || currentUser.role !== UserRole.Admin) {
    //   filter.status = HospitalStatus.ACTIVE
    //   filter.isActive = true
    // }

    // Apply filters
    if (province) {
      filter.province = { $regex: province, $options: 'i' }
    }

    if (district) {
      filter.district = { $regex: district, $options: 'i' }
    }

    if (ward) {
      filter.ward = { $regex: ward, $options: 'i' }
    }

    if (status && currentUser?.role === UserRole.Admin) {
      filter.status = status
    }

    if (isActive !== undefined) {
      filter.isActive = isActive
    }

    // Blood inventory filters
    if (bloodType) {
      filter['bloodInventory.bloodType'] = bloodType
    }

    if (component) {
      filter['bloodInventory.component'] = component
    }

    // Set search query if provided
    if (search) {
      reqDto.q = search
    }

    const searchFields = ['name', 'address', 'province', 'district', 'ward']

    return await PaginationUtil.paginate({
      model: this.hospitalModel,
      pageOptions: reqDto as PageOptionsDto,
      searchFields,
      sortField: 'createdAt',
      filter
    })
  }

  async findOne(id: string, currentUser?: CurrentUser): Promise<Hospital> {
    ValidateObjectId(id)

    const conditions: Record<string, unknown> = { _id: id, isDeleted: false }

    // Public users can only see ACTIVE and active hospitals
    if (!currentUser || currentUser.role !== UserRole.Admin) {
      conditions.status = HospitalStatus.ACTIVE
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
