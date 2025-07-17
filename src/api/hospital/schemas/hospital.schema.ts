import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaTypes, Types } from 'mongoose'
import { DEFAULT_OPERATING_HOURS } from '../../../constants/hospital.constant'
import { AbstractSchema } from '@database/schemas/abstract.schema'
import { BloodInventoryItem } from '@api/blood-inventory/schemas/blood-inventory-item.schema'

export type HospitalDocument = HydratedDocument<Hospital>

@Schema({ _id: false })
export class ContactInfo {
  @Prop({ required: true })
  phone: string

  @Prop()
  email?: string
}

@Schema({ _id: false })
export class Coordinates {
  @Prop({ required: true, type: Number })
  latitude: number

  @Prop({ required: true, type: Number })
  longitude: number
}

@Schema({ timestamps: true, collection: 'hospitals' })
export class Hospital extends AbstractSchema {
  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  address: string

  @Prop({ required: true })
  province: string

  @Prop({ required: true })
  district: string

  @Prop({ required: true })
  ward: string

  @Prop({ required: true, type: ContactInfo })
  contactInfo: ContactInfo

  @Prop({ default: DEFAULT_OPERATING_HOURS })
  operatingHours: string

  @Prop({ type: [String], default: [] })
  services: string[]

  @Prop({ type: [BloodInventoryItem], default: [] })
  bloodInventory: BloodInventoryItem[]

  @Prop({ required: true })
  emergencyContact: string

  @Prop({ required: true })
  description: string

  @Prop({ required: true, type: Coordinates })
  coordinates: Coordinates

  @Prop({ default: true })
  isActive: boolean

  @Prop()
  licenseNumber?: string

  @Prop({ type: Date })
  establishedDate?: Date

  @Prop({ default: false })
  isDeleted: boolean

  @Prop({
    type: {
      _id: { type: SchemaTypes.ObjectId, ref: 'User', default: null },
      email: { type: String, default: null }
    },
    default: null
  })
  createdAtBy: {
    _id: Types.ObjectId
    email: string
  }

  @Prop({
    type: {
      _id: { type: SchemaTypes.ObjectId, ref: 'User' },
      email: { type: String }
    },
    default: null
  })
  updatedAtBy: {
    _id: Types.ObjectId
    email: string
  }

  @Prop({
    type: {
      _id: { type: SchemaTypes.ObjectId, ref: 'User' },
      email: { type: String }
    },
    default: null
  })
  isDeletedBy: {
    _id: Types.ObjectId
    email: string
  }
}

export const HospitalSchema = SchemaFactory.createForClass(Hospital)

// Optimize indexes for better query performance
HospitalSchema.index({ name: 'text', address: 'text', description: 'text' })
HospitalSchema.index({ province: 1, district: 1, ward: 1 })
HospitalSchema.index({ 'coordinates.latitude': 1, 'coordinates.longitude': 1 })
HospitalSchema.index({ coordinates: '2dsphere' }) // For geospatial queries
HospitalSchema.index({ isActive: 1, isDeleted: 1 })
HospitalSchema.index({ 'bloodInventory.bloodType': 1, 'bloodInventory.component': 1 })
HospitalSchema.index({ 'bloodInventory.expiresAt': 1 }) // For expiration tracking
