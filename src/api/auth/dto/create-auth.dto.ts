import { EnumDeviceType } from '@api/refresh-token/types/enum'
import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsString } from 'class-validator'

export class CreateAuthDto {
  @ApiProperty({ example: 'admin123' })
  @IsNotEmpty()
  @IsString()
  username: string

  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  @IsString()
  password: string

  @ApiProperty({ example: EnumDeviceType.ANDROID })
  @IsNotEmpty()
  @IsEnum(EnumDeviceType)
  deviceInfo: EnumDeviceType
}
