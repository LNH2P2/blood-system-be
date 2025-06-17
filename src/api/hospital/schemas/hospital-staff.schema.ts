import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaTypes, Types } from 'mongoose'
import { HospitalStaffRole } from '../../../constants/hospital.constant'

export type HospitalStaffDocument = HydratedDocument<HospitalStaff>

@Schema({ timestamps: true, collection: 'hospital_staff' })
export class HospitalStaff {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
    required: true
  })
  userId: Types.ObjectId

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Hospital',
    required: true
  })
  hospitalId: Types.ObjectId

  @Prop({
    enum: Object.values(HospitalStaffRole),
    type: String,
    required: true
  })
  role: HospitalStaffRole

  @Prop({ default: true })
  isActive: boolean

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

export const HospitalStaffSchema = SchemaFactory.createForClass(HospitalStaff)

// Ensure unique user per hospital
HospitalStaffSchema.index({ userId: 1, hospitalId: 1 }, { unique: true })
HospitalStaffSchema.index({ hospitalId: 1, role: 1 })
HospitalStaffSchema.index({ isActive: 1, isDeleted: 1 })
