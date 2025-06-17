import { AbstractSchema } from '@database/schemas/abstract.schema'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaTypes, Types } from 'mongoose'
import { DonationRequestStatus } from 'src/constants/donation.constant'

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
}

export const DonationRequestSchema = SchemaFactory.createForClass(DonationRequest)
