import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class ResetPasswrodDto {
  @ApiProperty({ example: 'example@fpt.edu.vn' })
  @IsNotEmpty()
  @IsString()
  email: string

  @ApiProperty({ example: '123123123123' })
  @IsNotEmpty()
  @IsString()
  newPassword: string

  @ApiProperty({ example: '101011' })
  @IsNotEmpty()
  @IsNumber()
  otp: number
}
