import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets'
import { NotificationService } from './notification.service'
import { CreateNotificationDto } from './dto/create-notification.dto'
import { UpdateNotificationDto } from './dto/update-notification.dto'
import { Server } from 'socket.io'

@WebSocketGateway(80, { namespace: 'notification', cors: { origin: '*' } })
export class NotificationGateway {
  constructor(private readonly notificationService: NotificationService) {}

  @WebSocketServer()
  server: Server

  @SubscribeMessage('createNotification')
  async create(@MessageBody() createNotificationDto: CreateNotificationDto) {
    const notification = await this.notificationService.create(createNotificationDto)
    this.server.emit('notificationCreated', notification)
  }

  @SubscribeMessage('findAllNotification')
  async findAll() {
    const notifications = await this.notificationService.findAll()
    this.server.emit('allNotifications', notifications)
  }

  @SubscribeMessage('findOneNotification')
  async findOne(@MessageBody() id: string) {
    const notification = await this.notificationService.findOne(id)
    this.server.emit('notificationFound', notification)
  }

  @SubscribeMessage('updateNotification')
  async update(@MessageBody() updateNotificationDto: UpdateNotificationDto) {
    const notification = await this.notificationService.update(updateNotificationDto.id, updateNotificationDto)
    this.server.emit('notificationUpdated', notification)
  }

  @SubscribeMessage('removeNotification')
  async remove(@MessageBody() id: string) {
    const notification = await this.notificationService.remove(id)
    this.server.emit('notificationRemoved', notification)
  }
}
