import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateAddressDto {
  @ApiProperty({ example: 'nguyen trai' })
  @IsString()
  @IsNotEmpty()
  street: string

  @ApiProperty({ example: 'quận 9' })
  @IsString()
  @IsNotEmpty()
  district: string

  @ApiProperty({ example: 'Hồ Chí Minh' })
  @IsString()
  @IsNotEmpty()
  city: string

  @ApiProperty({ example: 'Việt nam' })
  @IsString()
  @IsNotEmpty()
  nation: string
}
