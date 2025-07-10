import { AbstractSchema } from '@database/schemas/abstract.schema'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { BlogStatus } from '../blog.constants'

export type BlogDocument = HydratedDocument<Blog>

@Schema({
  timestamps: true
})
export class Blog extends AbstractSchema {
  @Prop({ required: true })
  title: string

  @Prop()
  image: string

  @Prop({ required: true })
  summary: string

  @Prop({ required: true })
  content: string

  @Prop({
    enum: BlogStatus,
    default: BlogStatus.DRAFT
  })
  status: BlogStatus

  @Prop({ default: 0 })
  viewCount: number
}

export const BlogSchema = SchemaFactory.createForClass(Blog)
