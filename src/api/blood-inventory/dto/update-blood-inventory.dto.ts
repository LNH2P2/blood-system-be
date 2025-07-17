import { ApiProperty, PartialType } from '@nestjs/swagger'
import { CreateBloodInventoryItemDto } from './create-blood-inventory.dto'
import { ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class UpdateBloodInventoryItemDto extends PartialType(CreateBloodInventoryItemDto) {}

export class UpdateBloodInventoryDto {
  @ApiProperty({
    type: UpdateBloodInventoryItemDto,
    description: 'Blood inventory item to update'
  })
  @ValidateNested()
  @Type(() => UpdateBloodInventoryItemDto)
  item: UpdateBloodInventoryItemDto
}
