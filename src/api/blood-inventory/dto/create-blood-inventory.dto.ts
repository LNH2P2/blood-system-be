import { BloodInventoryItemDto } from '@api/hospital/dto/create-hospital.dto'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { ValidateNested } from 'class-validator'

export class CreateBloodInventoryDto {
  @ApiProperty({
    type: BloodInventoryItemDto,
    description: 'Blood inventory item to add'
  })
  @ValidateNested()
  @Type(() => BloodInventoryItemDto)
  item: BloodInventoryItemDto
}
