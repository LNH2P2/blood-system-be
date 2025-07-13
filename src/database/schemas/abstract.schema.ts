import { Prop, Schema } from '@nestjs/mongoose'
import mongoose, { Document } from 'mongoose'

@Schema()
export abstract class AbstractSchema extends Document {
  @Prop()
  createdAt: Date

  @Prop()
  updatedAt: Date
}
