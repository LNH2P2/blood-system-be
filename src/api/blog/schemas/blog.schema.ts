import { AbstractSchema } from '@database/schemas/abstract.schema'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { BlogStatus } from '../blog.constants'

export type BlogDocument = HydratedDocument<Blog>

@Schema({
  timestamps: true
})
export class Blog extends AbstractSchema {
  @Prop()
  title: string

  @Prop()
  content: string

  @Prop()
  status: BlogStatus

  @Prop()
  viewCount: number
}

export const BlogSchema = SchemaFactory.createForClass(Blog)
