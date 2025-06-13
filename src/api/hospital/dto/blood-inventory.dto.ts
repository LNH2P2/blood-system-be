import { IsArray, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { BloodInventoryItemDto } from './create-hospital.dto'

export class UpdateBloodInventoryDto {
  @ApiProperty({
    type: [BloodInventoryItemDto],
    description: 'Blood inventory items to update'
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BloodInventoryItemDto)
  bloodInventory: BloodInventoryItemDto[]
}

export class AddBloodInventoryDto {
  @ApiProperty({
    type: BloodInventoryItemDto,
    description: 'Blood inventory item to add'
  })
  @ValidateNested()
  @Type(() => BloodInventoryItemDto)
  item: BloodInventoryItemDto
}
