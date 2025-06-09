import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type AddressDocument = Document & Address

@Schema({ _id: true }) // Cho phép mỗi address có _id riêng
export class Address {
  @Prop({ required: true })
  street: string

  @Prop({ required: true })
  district: string

  @Prop({ required: true })
  city: string

  @Prop({ required: true })
  nation: string
}

export const AddressSchema = SchemaFactory.createForClass(Address)
