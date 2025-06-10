import { AbstractSchema } from '@database/schemas/abstract.schema'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { NotificationType } from '../notification.constants'

export type NotificationDocument = HydratedDocument<Notification>

@Schema({
  timestamps: true
})
export class Notification extends AbstractSchema {
  @Prop()
  content: string

  @Prop()
  type: NotificationType

  @Prop()
  isRead: boolean
}

export const NotificationSchema = SchemaFactory.createForClass(Notification)
