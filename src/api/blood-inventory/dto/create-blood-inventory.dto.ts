import { BloodInventoryItemDto } from '@api/hospital/dto/create-hospital.dto'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { ValidateNested, IsString, IsNotEmpty } from 'class-validator'

export class CreateBloodInventoryItemDto extends BloodInventoryItemDto {
  @ApiProperty({
    description: 'Hospital ID',
    example: '60c72b2f9b1e8d001c8e4f1a'
  })
  @IsString()
  @IsNotEmpty()
  hospitalId: string
}

export class CreateBloodInventoryDto {
  @ApiProperty({
    type: CreateBloodInventoryItemDto,
    description: 'Blood inventory item to add'
  })
  @ValidateNested()
  @Type(() => CreateBloodInventoryItemDto)
  item: CreateBloodInventoryItemDto
}
