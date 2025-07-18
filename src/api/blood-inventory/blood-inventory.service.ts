import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectModel, Schema } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { CreateBloodInventoryDto } from './dto/create-blood-inventory.dto'
import { UpdateBloodInventoryDto } from './dto/update-blood-inventory.dto'
import { ListBloodInventoryDto } from './dto/list-blood-inventory.req.dto'
import { BloodInventoryItem, BloodInventoryItemDocument } from './schemas/blood-inventory-item.schema'
import { Hospital, HospitalDocument } from '@api/hospital/schemas/hospital.schema'
import { ValidateObjectId } from '@exceptions/validattion.exception'
import { PaginationUtil } from '@utils/pagination.util'
import { PageOptionsDto } from '@common/dto/offset-pagination/page-options.dto'

@Injectable()
export class BloodInventoryService {
  constructor(
    @InjectModel(BloodInventoryItem.name)
    private readonly bloodInventoryModel: Model<BloodInventoryItemDocument>,
    @InjectModel(Hospital.name)
    private readonly hospitalModel: Model<HospitalDocument>
  ) {}

  async create(createBloodInventoryDto: CreateBloodInventoryDto) {
    const { item } = createBloodInventoryDto

    // Validate hospital exists
    const hospital = await this.hospitalModel.findById(item.hospitalId)
    if (!hospital) {
      throw new NotFoundException('Hospital not found')
    }

    // Validate expiration date
    const expirationDate = new Date(item.expiresAt)
    if (isNaN(expirationDate.getTime())) {
      throw new BadRequestException('Invalid expiration date')
    }

    if (expirationDate <= new Date()) {
      throw new BadRequestException('Expiration date must be in the future')
    }

    // Convert string to Date for storage
    const inventoryData = {
      ...item,
      expiresAt: expirationDate,
      hospitalId: item.hospitalId
    }

    const bloodInventoryItem = new this.bloodInventoryModel(inventoryData)
    const newBloodInventoryItem = await bloodInventoryItem.save()
    await this.hospitalModel.findByIdAndUpdate(
      item.hospitalId,
      { $push: { bloodInventory: newBloodInventoryItem } },
      { new: true }
    )

    return newBloodInventoryItem
  }

  async findAll(query?: ListBloodInventoryDto) {
    if (!query) {
      return await this.bloodInventoryModel.find().populate('hospitalId', 'name address').sort({ createdAt: -1 }).exec()
    }

    const { bloodType, component, province, district, ward, address, ...pageOptions } = query

    // Build blood inventory filters
    const bloodInventoryFilters: any = {}

    if (bloodType) {
      bloodInventoryFilters.bloodType = bloodType
    }

    if (component) {
      bloodInventoryFilters.component = component
    }

    // If no hospital-related filters, use simple pagination
    if (!province && !district && !ward && !address) {
      return await PaginationUtil.paginate({
        model: this.bloodInventoryModel,
        pageOptions: pageOptions as PageOptionsDto,
        sortField: 'createdAt',
        filter: bloodInventoryFilters,
        populate: [{ path: 'hospitalId', select: 'name address province district ward' }]
      })
    }

    // Build hospital filters for aggregation
    const hospitalFilters: any = {}

    if (province) {
      hospitalFilters.province = { $regex: province, $options: 'i' }
    }

    if (district) {
      hospitalFilters.district = { $regex: district, $options: 'i' }
    }

    if (ward) {
      hospitalFilters.ward = { $regex: ward, $options: 'i' }
    }

    if (address) {
      hospitalFilters.address = { $regex: address, $options: 'i' }
    }

    // Use aggregation pipeline to filter by hospital location
    const aggregationPipeline: any[] = [
      // Match blood inventory filters first
      ...(Object.keys(bloodInventoryFilters).length > 0 ? [{ $match: bloodInventoryFilters }] : []),

      // Join with hospital collection
      {
        $lookup: {
          from: 'hospitals',
          localField: 'hospitalId',
          foreignField: '_id',
          as: 'hospital'
        }
      },

      // Unwind hospital array
      { $unwind: '$hospital' },

      // Match hospital filters
      ...(Object.keys(hospitalFilters).length > 0
        ? [
            {
              $match: {
                ...Object.keys(hospitalFilters).reduce(
                  (acc, key) => ({ ...acc, [`hospital.${key}`]: hospitalFilters[key] }),
                  {}
                )
              }
            }
          ]
        : []),

      // Add hospital data to result
      {
        $addFields: {
          hospitalId: {
            _id: '$hospital._id',
            name: '$hospital.name',
            address: '$hospital.address',
            province: '$hospital.province',
            district: '$hospital.district',
            ward: '$hospital.ward'
          }
        }
      },

      // Remove the hospital field
      { $project: { hospital: 0 } },

      // Sort by createdAt
      { $sort: { createdAt: -1 } }
    ]

    // Execute aggregation
    const items = await this.bloodInventoryModel.aggregate(aggregationPipeline)

    // Handle pagination manually for aggregation
    const page = pageOptions.page || 1
    const limit = pageOptions.limit || 10
    const skip = (page - 1) * limit

    // Get total count
    const totalCountPipeline: any[] = [...aggregationPipeline, { $count: 'total' }]

    const totalResult = await this.bloodInventoryModel.aggregate(totalCountPipeline)
    const totalRecords = totalResult.length > 0 ? totalResult[0].total : 0

    // Apply pagination
    const paginatedItems = items.slice(skip, skip + limit)

    // Return paginated result
    return {
      data: paginatedItems,
      meta: {
        page,
        limit,
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
        hasPreviousPage: page > 1,
        hasNextPage: page < Math.ceil(totalRecords / limit)
      },
      message: 'Blood inventory items retrieved successfully',
      statusCode: 200
    }
  }

  async findByHospital(hospitalId: string) {
    ValidateObjectId(hospitalId)

    const hospital = await this.hospitalModel.findById(hospitalId)
    if (!hospital) {
      throw new NotFoundException('Hospital not found')
    }

    return await this.bloodInventoryModel
      .find({ hospitalId })
      .populate('hospitalId', 'name address')
      .sort({ createdAt: -1 })
      .exec()
  }

  async findOne(id: string) {
    ValidateObjectId(id)

    const bloodInventoryItem = await this.bloodInventoryModel.findById(id).populate('hospitalId', 'name address').exec()

    if (!bloodInventoryItem) {
      throw new NotFoundException('Blood inventory item not found')
    }

    return bloodInventoryItem
  }

  async update(id: string, updateBloodInventoryDto: UpdateBloodInventoryDto) {
    ValidateObjectId(id)

    const existingItem = await this.bloodInventoryModel.findById(id)
    if (!existingItem) {
      throw new NotFoundException('Blood inventory item not found')
    }

    const updateData = { ...updateBloodInventoryDto.item }

    // Validate expiration date if provided
    if (updateData.expiresAt) {
      const expirationDate = new Date(updateData.expiresAt)
      if (isNaN(expirationDate.getTime())) {
        throw new BadRequestException('Invalid expiration date')
      }

      if (expirationDate <= new Date()) {
        throw new BadRequestException('Expiration date must be in the future')
      }

      updateData.expiresAt = expirationDate as any
    }

    // Validate hospital if provided and handle hospital change
    const oldHospitalId = existingItem.hospitalId.toString()
    let newHospitalId = oldHospitalId

    if (updateData.hospitalId) {
      const hospital = await this.hospitalModel.findById(updateData.hospitalId)
      if (!hospital) {
        throw new NotFoundException('Hospital not found')
      }
      newHospitalId = updateData.hospitalId
      updateData.hospitalId = updateData.hospitalId as any
    }

    const updatedItem = await this.bloodInventoryModel
      .findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .populate('hospitalId', 'name address')
      .exec()

    // Sync with hospital collection
    if (updatedItem) {
      const embeddedItem = {
        _id: updatedItem._id,
        bloodType: updatedItem.bloodType,
        component: updatedItem.component,
        quantity: updatedItem.quantity,
        expiresAt: updatedItem.expiresAt,
        createdAt: updatedItem.createdAt,
        updatedAt: updatedItem.updatedAt,
        hospitalId: updatedItem.hospitalId
      }

      // If hospital changed, remove from old hospital and add to new
      if (oldHospitalId !== newHospitalId) {
        // Remove from old hospital
        await this.hospitalModel.findByIdAndUpdate(oldHospitalId, {
          $pull: {
            bloodInventory: existingItem
          }
        })

        // Add to new hospital
        await this.hospitalModel.findByIdAndUpdate(newHospitalId, { $push: { bloodInventory: embeddedItem } })
      } else {
        // Update existing item in same hospital - remove old and add new
        // First remove the old item using its _id
        await this.hospitalModel.findByIdAndUpdate(oldHospitalId, {
          $pull: {
            bloodInventory: { _id: existingItem._id }
          }
        })

        // Then add the updated item
        await this.hospitalModel.findByIdAndUpdate(oldHospitalId, { $push: { bloodInventory: embeddedItem } })
      }
    }

    return updatedItem
  }

  async remove(id: string) {
    ValidateObjectId(id)

    const itemToDelete = await this.bloodInventoryModel.findById(id)
    if (!itemToDelete) {
      throw new NotFoundException('Blood inventory item not found')
    }

    // Delete from blood inventory collection
    const result = await this.bloodInventoryModel.findByIdAndDelete(id)
    if (!result) {
      throw new NotFoundException('Blood inventory item not found')
    }

    // Sync with hospital collection - remove from embedded bloodInventory array
    await this.hospitalModel.findByIdAndUpdate(itemToDelete.hospitalId, {
      $pull: {
        bloodInventory: { _id: itemToDelete._id }
      }
    })

    return { message: 'Blood inventory item deleted successfully' }
  }

  async removeExpiredItems() {
    const now = new Date()

    // First, get all expired items for syncing
    const expiredItems = await this.bloodInventoryModel.find({
      expiresAt: { $lt: now }
    })

    // Delete expired items from blood inventory collection
    const result = await this.bloodInventoryModel.deleteMany({
      expiresAt: { $lt: now }
    })

    // Sync with hospital collection - remove expired items from embedded arrays
    for (const expiredItem of expiredItems) {
      await this.hospitalModel.findByIdAndUpdate(expiredItem.hospitalId, {
        $pull: {
          bloodInventory: { _id: expiredItem._id }
        }
      })
    }

    return {
      message: `Removed ${result.deletedCount} expired blood inventory items`
    }
  }
}
