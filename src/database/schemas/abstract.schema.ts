import { Prop, Schema } from '@nestjs/mongoose'
import mongoose, { Document } from 'mongoose'

@Schema()
export abstract class AbstractSchema extends Document {
  @Prop({
    type: String,
    default: () => new mongoose.Types.ObjectId().toString()
  })
  declare _id: string

  @Prop()
  createdAt: Date

  @Prop()
  updatedAt: Date
}
