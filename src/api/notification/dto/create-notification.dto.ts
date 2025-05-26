import { IsBoolean, IsNotEmpty, IsString } from 'class-validator'
import { NotificationType } from '../notification.constants'

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  content: string

  @IsString()
  @IsNotEmpty()
  type: NotificationType

  @IsBoolean()
  isRead: boolean = false
}
