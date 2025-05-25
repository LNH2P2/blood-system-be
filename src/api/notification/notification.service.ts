import { Injectable } from '@nestjs/common'
import { CreateNotificationDto } from './dto/create-notification.dto'
import { UpdateNotificationDto } from './dto/update-notification.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Notification, NotificationDocument } from './schemas/notification.schema'

@Injectable()
export class NotificationService {
  constructor(@InjectModel(Notification.name) private readonly notificationModel: Model<NotificationDocument>) {}

  async create(createNotificationDto: CreateNotificationDto) {
    return this.notificationModel.create(createNotificationDto)
  }

  async findAll() {
    return this.notificationModel.find()
  }

  async findOne(id: string) {
    return this.notificationModel.findById(id)
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`
  }

  remove(id: number) {
    return `This action removes a #${id} notification`
  }
}
