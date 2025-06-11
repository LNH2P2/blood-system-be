import { Prop } from '@nestjs/mongoose'
import { IsDate, IsEnum, IsNotEmpty, IsString } from 'class-validator'
import { Types } from 'mongoose'
import { EnumDeviceType } from './../types/enum'

export class CreateRefreshTokenDto {
  @Prop({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  token: string

  @Prop({ type: Date, required: true })
  @IsNotEmpty()
  @IsDate()
  expiresAt: Date

  @Prop({ required: true, enum: EnumDeviceType })
  @IsEnum(EnumDeviceType)
  deviceInfo: EnumDeviceType

  @Prop({ required: true })
  @IsNotEmpty()
  user: Types.ObjectId
}
