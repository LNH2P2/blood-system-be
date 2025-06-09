import { PartialType } from '@nestjs/mapped-types'
import { ApiProperty } from '@nestjs/swagger'
import { CreateAddressDto } from './create-address.dto'

export class UpdateAddressDto extends PartialType(CreateAddressDto) {
  @ApiProperty({ example: 'nguyễn trãi' })
  street: string

  @ApiProperty({ example: 'quận 9' })
  district: string

  @ApiProperty({ example: 'Hồ Chí Minh' })
  city: string

  @ApiProperty({ example: 'Viet Nam' })
  nation: string
}
