import { AbstractSchema } from '@database/schemas/abstract.schema'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'
import { BlogStatus } from '../blog.constants'
import { Category } from '@api/category/schemas/category.schema'

export type BlogDocument = HydratedDocument<Blog>

@Schema({
  timestamps: true
})
export class Blog extends AbstractSchema {
  @Prop()
  title: string

  @Prop()
  image: string

  @Prop()
  summary: string

  @Prop()
  content: string

  @Prop()
  status: BlogStatus

  @Prop()
  viewCount: number

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Category.name })
  category: Category
}

export const BlogSchema = SchemaFactory.createForClass(Blog)
