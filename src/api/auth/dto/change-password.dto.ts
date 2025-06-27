import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class ChangePasswrodDto {
  @ApiProperty({ example: 'fdsarewqfgwgvdsagdsag' })
  @IsNotEmpty()
  @IsString()
  userId: string

  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  @IsString()
  oldPassword: string

  @ApiProperty({ example: '123123123123' })
  @IsNotEmpty()
  @IsString()
  newPassword: string
}
