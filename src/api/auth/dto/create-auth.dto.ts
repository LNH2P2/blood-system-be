import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateAuthDto {
  @ApiProperty({ example: 'admin123' })
  @IsNotEmpty()
  @IsString()
  username: string

  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  @IsString()
  password: string
}
