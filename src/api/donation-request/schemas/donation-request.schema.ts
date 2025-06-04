import { AbstractSchema } from '@database/schemas/abstract.schema'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { DonationRequestStatus } from 'src/constants/donation.constant'

export type DonationRequestDocument = HydratedDocument<DonationRequest>

@Schema({ timestamps: true, collection: 'donation_requests' })
export class DonationRequest extends AbstractSchema {
  @Prop({ required: true })
  userId: string

  @Prop({ required: true, enum: DonationRequestStatus })
  status: DonationRequestStatus

  @Prop({ required: true })
  medicalFacilityId: string

  @Prop({ required: true })
  scheduleDate: Date

  @Prop()
  note?: string
}

export const DonationRequestSchema = SchemaFactory.createForClass(DonationRequest)
