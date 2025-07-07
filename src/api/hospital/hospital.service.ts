import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Hospital, HospitalDocument } from './schemas/hospital.schema'
import { CreateHospitalDto } from './dto/create-hospital.dto'
import { UpdateHospitalDto } from './dto/update-hospital.dto'
import { HospitalQueryDto } from './dto/hospital-query.dto'
import { ValidateObjectId } from '../../exceptions/validattion.exception'
import { BloodInventoryItem } from './interfaces/hospital.interface'
import { PaginationUtil } from '../../utils/pagination.util'
import { PageOptionsDto } from '@common/dto/offset-pagination/page-options.dto'

@Injectable()
export class HospitalService {
  constructor(
    @InjectModel(Hospital.name)
    private hospitalModel: Model<HospitalDocument>
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
      throw new BadRequestException('Failed to create hospital')
    }
  }

  /**
   * Enhanced search with better performance
   * TODO: Add full-text search indexing for better performance
   */
  async findAll(query: HospitalQueryDto) {
    const { search, province, district, ward, isActive, bloodType, component, ...reqDto } = query

    // Build filter conditions with optimized queries
    const filter: Record<string, unknown> = { isDeleted: false }

    // Optimize location filtering with compound indexes
    const locationFilter: Record<string, unknown> = {}
    if (province) locationFilter.province = { $regex: province, $options: 'i' }
    if (district) locationFilter.district = { $regex: district, $options: 'i' }
    if (ward) locationFilter.ward = { $regex: ward, $options: 'i' }

    Object.assign(filter, locationFilter)

    // Apply filters
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
    const hospital = await this.hospitalModel.findOne(conditions)
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
      .findByIdAndUpdate(
        id,
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

  /**
   * Add method to find hospitals within radius
   */
  async findNearby(latitude: number, longitude: number, radiusKm: number = 10): Promise<Hospital[]> {
    return this.hospitalModel
      .find({
        isDeleted: false,
        isActive: true,
        coordinates: {
          $near: {
            $geometry: { type: 'Point', coordinates: [longitude, latitude] },
            $maxDistance: radiusKm * 1000 // Convert km to meters
          }
        }
      })
      .limit(20)
      .lean()
      .exec()
  }

  /**
   * Get blood inventory summary across all hospitals
   */
  async getBloodInventorySummary() {
    return this.hospitalModel.aggregate([
      { $match: { isDeleted: false, isActive: true } },
      { $unwind: '$bloodInventory' },
      {
        $group: {
          _id: {
            bloodType: '$bloodInventory.bloodType',
            component: '$bloodInventory.component'
          },
          totalQuantity: { $sum: '$bloodInventory.quantity' },
          hospitals: { $addToSet: { id: '$_id', name: '$name' } }
        }
      },
      {
        $project: {
          bloodType: '$_id.bloodType',
          component: '$_id.component',
          totalQuantity: 1,
          hospitalCount: { $size: '$hospitals' },
          hospitals: 1,
          _id: 0
        }
      }
    ])
  }
}
