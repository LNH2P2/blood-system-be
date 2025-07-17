import { ApiProperty, PartialType } from '@nestjs/swagger'
import { CreateBloodInventoryDto } from './create-blood-inventory.dto'
import { BloodInventoryItemDto } from '@api/hospital/dto/create-hospital.dto'
import { IsArray, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class UpdateBloodInventoryDto extends PartialType(CreateBloodInventoryDto) {
  @ApiProperty({
    type: [BloodInventoryItemDto],
    description: 'Blood inventory items to update'
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BloodInventoryItemDto)
  bloodInventory: BloodInventoryItemDto[]
}
