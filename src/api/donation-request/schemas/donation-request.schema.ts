import { AbstractSchema } from '@database/schemas/abstract.schema'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { DonationMatchStatus } from 'src/constants/donation.constant'

export type DonationRequestDocument = HydratedDocument<DonationRequest>

@Schema({ timestamps: true, collection: 'donation_matches' })
export class DonationRequest extends AbstractSchema {
  @Prop({ required: true })
  requestId: string

  @Prop({ required: true })
  donorId: string

  @Prop({ required: true })
  bloodBankId: string

  @Prop({ required: true, enum: DonationMatchStatus })
  status: DonationMatchStatus

  @Prop({ required: true })
  scheduleDate: Date

  @Prop()
  completedDate?: Date

  @Prop()
  note?: string
}

export const DonationRequestSchema = SchemaFactory.createForClass(DonationRequest)
