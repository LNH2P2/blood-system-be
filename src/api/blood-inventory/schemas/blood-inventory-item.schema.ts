import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { BloodComponent, BloodType } from '@constants/hospital.constant'
import { HydratedDocument, SchemaTypes, Types } from 'mongoose'
import { AbstractSchema } from '@database/schemas/abstract.schema'

export type BloodInventoryItemDocument = HydratedDocument<BloodInventoryItem>

@Schema({ timestamps: true, collection: 'blood_inventory_item' })
export class BloodInventoryItem extends AbstractSchema {
  @Prop({
    required: true,
    enum: Object.values(BloodType),
    type: String
  })
  bloodType: BloodType

  @Prop({
    required: true,
    enum: Object.values(BloodComponent),
    type: String
  })
  component: BloodComponent

  @Prop({ required: true, type: Number, min: 0 })
  quantity: number

  @Prop({ required: true, type: Date })
  expiresAt: Date

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Hospital'
  })
  hospitalId: Types.ObjectId
}

export const BloodInventoryItemSchema = SchemaFactory.createForClass(BloodInventoryItem)

// Index for efficient queries
BloodInventoryItemSchema.index({ hospitalId: 1 })
BloodInventoryItemSchema.index({ bloodType: 1, component: 1 })
BloodInventoryItemSchema.index({ expiresAt: 1 })
