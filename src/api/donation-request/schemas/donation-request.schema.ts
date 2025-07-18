import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaTypes, Types } from 'mongoose'
import { DonationRequestStatus, DonationRequestPriority } from 'src/constants/donation.constant'

export type DonationRequestDocument = HydratedDocument<DonationRequest>

@Schema({ timestamps: true, collection: 'donation_requests' })
export class DonationRequest {
  @Prop({ required: true })
  userId: string

  @Prop({ required: true, enum: DonationRequestStatus })
  status: DonationRequestStatus

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'Hospital' })
  hospitalId: Types.ObjectId

  @Prop({ required: true })
  scheduleDate: Date

  @Prop()
  note?: string

  // Bổ sung các trường cho UI
  @Prop({ required: true, default: 'O+' })
  bloodType: string

  @Prop({ required: true, default: 100 })
  quantity: number // Số lượng máu (ml)

  @Prop({ required: true, enum: DonationRequestPriority, default: DonationRequestPriority.NORMAL })
  priority: DonationRequestPriority

  @Prop({})
  location?: string

  @Prop({ required: true })
  createdBy: string
}

export const DonationRequestSchema = SchemaFactory.createForClass(DonationRequest)
