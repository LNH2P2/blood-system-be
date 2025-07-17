import { PageOptionsDto } from '@common/dto/offset-pagination/page-options.dto'
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Hospital, HospitalDocument } from './schemas/hospital.schema'
import { HospitalStaff, HospitalStaffDocument } from './schemas/hospital-staff.schema'
import { CreateHospitalDto } from './dto/create-hospital.dto'
import { HospitalQueryDto } from './dto/hospital-query.dto'
import { UpdateHospitalDto } from './dto/update-hospital.dto'
import { ValidateObjectId } from '../../exceptions/validattion.exception'
import { PaginationUtil } from '../../utils/pagination.util'
import {
  BloodInventoryItem,
  BloodInventoryItemDocument
} from '@api/blood-inventory/schemas/blood-inventory-item.schema'

@Injectable()
export class HospitalService {
  constructor(
    @InjectModel(Hospital.name)
    private readonly hospitalModel: Model<HospitalDocument>,
    @InjectModel(HospitalStaff.name)
    private readonly hospitalStaffModel: Model<HospitalStaffDocument>,
    @InjectModel(BloodInventoryItem.name)
    private readonly bloodInventoryItemModel: Model<BloodInventoryItemDocument>
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
          // Check if expiresAt is valid
          if (!item.expiresAt) {
            throw new BadRequestException(
              `Blood inventory item missing expiration date: ${item.bloodType} ${item.component}`
            )
          }

          const expirationDate = new Date(item.expiresAt)
          if (isNaN(expirationDate.getTime())) {
            throw new BadRequestException(
              `Blood inventory item has invalid expiration date: ${item.bloodType} ${item.component}`
            )
          }

          if (expirationDate <= now) {
            throw new BadRequestException(
              `Blood inventory item expires in the past: ${item.bloodType} ${item.component}`
            )
          }

          // Convert string to Date object for storage
          item.expiresAt = expirationDate as any
        }
      }

      let savedBloodInventoryItems: any[] = []

      // Create blood inventory items in separate collection first if provided
      if (createHospitalDto.bloodInventory && createHospitalDto.bloodInventory.length > 0) {
        const bloodInventoryItems = createHospitalDto.bloodInventory.map((item) => ({
          ...item,
          hospitalId: null, // Will be set after hospital creation
          expiresAt: new Date(item.expiresAt)
        }))

        savedBloodInventoryItems = await this.bloodInventoryItemModel.insertMany(bloodInventoryItems)
      }

      // Create hospital with blood inventory items that have the same _id
      const hospitalData = {
        ...createHospitalDto,
        bloodInventory:
          savedBloodInventoryItems.length > 0 ? savedBloodInventoryItems : createHospitalDto.bloodInventory
      }

      const hospital = new this.hospitalModel(hospitalData)
      const savedHospital = await hospital.save()

      // Update the hospitalId in the blood inventory items if they exist
      if (savedBloodInventoryItems.length > 0) {
        await this.bloodInventoryItemModel.updateMany(
          { _id: { $in: savedBloodInventoryItems.map((item) => item._id) } },
          { $set: { hospitalId: savedHospital._id } }
        )

        // Update the hospital's bloodInventory with the correct hospitalId
        await this.hospitalModel.findByIdAndUpdate(savedHospital._id, {
          $set: { bloodInventory: savedBloodInventoryItems.map((item) => ({ ...item, hospitalId: savedHospital._id })) }
        })
      }

      return savedHospital
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
        // Check if expiresAt is valid
        if (!item.expiresAt) {
          throw new BadRequestException(
            `Blood inventory item missing expiration date: ${item.bloodType} ${item.component}`
          )
        }

        const expirationDate = new Date(item.expiresAt)
        if (isNaN(expirationDate.getTime())) {
          throw new BadRequestException(
            `Blood inventory item has invalid expiration date: ${item.bloodType} ${item.component}`
          )
        }

        if (expirationDate <= now) {
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
      // Check if expiresAt is valid
      if (!item.expiresAt) {
        throw new BadRequestException(
          `Blood inventory item missing expiration date: ${item.bloodType} ${item.component}`
        )
      }

      const expirationDate = new Date(item.expiresAt)
      if (isNaN(expirationDate.getTime())) {
        throw new BadRequestException(
          `Blood inventory item has invalid expiration date: ${item.bloodType} ${item.component}`
        )
      }

      if (expirationDate <= now) {
        throw new BadRequestException(`Blood inventory item expires in the past: ${item.bloodType} ${item.component}`)
      }
    }

    // First, remove all existing blood inventory items for this hospital from separate collection
    await this.bloodInventoryItemModel.deleteMany({ hospitalId: id })

    // Create new blood inventory items in separate collection
    const bloodInventoryItems = bloodInventory.map((item) => ({
      ...item,
      hospitalId: new Types.ObjectId(id),
      expiresAt: new Date(item.expiresAt)
    }))

    if (bloodInventoryItems.length > 0) {
      await this.bloodInventoryItemModel.insertMany(bloodInventoryItems)
    }

    // Update hospital's embedded bloodInventory array
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
    if (!bloodItem.expiresAt) {
      throw new BadRequestException(
        `Blood inventory item missing expiration date: ${bloodItem.bloodType} ${bloodItem.component}`
      )
    }

    const expirationDate = new Date(bloodItem.expiresAt)
    if (isNaN(expirationDate.getTime())) {
      throw new BadRequestException(
        `Blood inventory item has invalid expiration date: ${bloodItem.bloodType} ${bloodItem.component}`
      )
    }

    if (expirationDate <= new Date()) {
      throw new BadRequestException(
        `Blood inventory item expires in the past: ${bloodItem.bloodType} ${bloodItem.component}`
      )
    }

    // Create item in separate blood inventory collection
    const bloodInventoryItemData = {
      ...bloodItem,
      hospitalId: new Types.ObjectId(id),
      expiresAt: expirationDate
    }

    const newBloodInventoryItem = new this.bloodInventoryItemModel(bloodInventoryItemData)
    await newBloodInventoryItem.save()

    // Add to hospital's embedded bloodInventory array
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
