import { ApiProperty } from '@nestjs/swagger'

export class CreateCategoryDto {
  @ApiProperty({
    description: 'The name of the category',
    example: 'Category 1'
  })
  name: string

  @ApiProperty({
    description: 'The description of the category',
    example: 'This is the description of category 1'
  })
  description: string
}
