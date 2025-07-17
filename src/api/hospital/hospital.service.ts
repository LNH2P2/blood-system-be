import { PageOptionsDto } from '@common/dto/offset-pagination/page-options.dto'
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ValidateObjectId } from '../../exceptions/validattion.exception'
import { PaginationUtil } from '../../utils/pagination.util'
import { CreateHospitalDto } from './dto/create-hospital.dto'
import { HospitalQueryDto } from './dto/hospital-query.dto'
import { UpdateHospitalDto } from './dto/update-hospital.dto'
import { BloodInventoryItem } from './interfaces/hospital.interface'
import { HospitalStaff, HospitalStaffDocument } from './schemas/hospital-staff.schema'
import { Hospital, HospitalDocument } from './schemas/hospital.schema'

@Injectable()
export class HospitalService {
  constructor(
    @InjectModel(Hospital.name)
    private hospitalModel: Model<HospitalDocument>,
    @InjectModel(HospitalStaff.name)
    private hospitalStaffModel: Model<HospitalStaffDocument>
  ) {}

  async create(createHospitalDto: CreateHospitalDto): Promise<Hospital> {
    try {
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
        ...createHospitalDto
      })

      return await hospital.save()
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof ForbiddenException) {
        throw error
      }
      throw new BadRequestException('Failed to create hospital', error.message)
    }
  }
  async findAll(query: HospitalQueryDto) {
    const { search, province, district, ward, isActive, bloodType, component, ...reqDto } = query

    // Build filter conditions
    const filter: Record<string, unknown> = { isDeleted: false }

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
  async findOne(id: string): Promise<Hospital> {
    ValidateObjectId(id)

    const conditions: Record<string, unknown> = { _id: id, isDeleted: false }

    const hospital = await this.hospitalModel.findOne(conditions).lean().exec()

    if (!hospital) {
      throw new NotFoundException('Hospital not found')
    }

    return hospital
  }

  async update(id: string, updateHospitalDto: UpdateHospitalDto): Promise<Hospital> {
    ValidateObjectId(id)

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
          ...updateHospitalDto
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

  async remove(id: string): Promise<void> {
    ValidateObjectId(id)

    const result = await this.hospitalModel
      .findOneAndUpdate(
        { _id: id, isDeleted: false },
        {
          isDeleted: true
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
        isDeleted: true
      }
    )
  }

  async updateBloodInventory(id: string, bloodInventory: BloodInventoryItem[]): Promise<Hospital> {
    ValidateObjectId(id)

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
          bloodInventory
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

  async addBloodInventory(id: string, bloodItem: BloodInventoryItem): Promise<Hospital> {
    ValidateObjectId(id)

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
          $push: { bloodInventory: bloodItem }
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

  async getHospitalNames() {
    try {
      const hospitals = await this.hospitalModel
        .find({ isDeleted: false })
        .sort({ createdAt: -1 })
        .select('name _id')
        .lean()
        .exec()

      if (!hospitals || hospitals.length === 0) {
        throw new NotFoundException('No active hospitals found')
      }

      return hospitals.map((hospital) => ({
        name: hospital.name,
        _id: hospital._id
      }))
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof ForbiddenException) {
        throw error
      }
      throw new BadRequestException('Failed to get hospital names', {
        cause: error,
        description: error.message
      })
    }
  }
}
