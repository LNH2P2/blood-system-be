import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { AbstractSchema } from 'src/database/schemas/abstract.schema'

export type CatDocument = HydratedDocument<Cat>

@Schema({
  timestamps: true
})
export class Cat extends AbstractSchema {
  @Prop()
  name: string

  @Prop()
  age: number

  @Prop()
  breed: string
}

export const CatSchema = SchemaFactory.createForClass(Cat)
