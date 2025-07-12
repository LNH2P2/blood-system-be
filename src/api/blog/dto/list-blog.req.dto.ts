import { PageOptionsDto } from '@common/dto/offset-pagination/page-options.dto'
import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, IsEnum, IsDateString, IsNumber, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { BlogStatus } from '../blog.constants'

export class ListBlogReqDto extends PageOptionsDto {
  @ApiProperty({
    required: false,
    enum: BlogStatus,
    description: 'Filter by blog status'
  })
  @IsOptional()
  @IsEnum(BlogStatus)
  readonly status?: BlogStatus

  @ApiProperty({
    required: false,
    description: 'Filter blogs created after this date (ISO string)'
  })
  @IsOptional()
  @IsDateString()
  readonly createdFrom?: string

  @ApiProperty({
    required: false,
    description: 'Filter blogs created before this date (ISO string)'
  })
  @IsOptional()
  @IsDateString()
  readonly createdTo?: string

  @ApiProperty({
    required: false,
    description: 'Filter blogs updated after this date (ISO string)'
  })
  @IsOptional()
  @IsDateString()
  readonly updatedFrom?: string

  @ApiProperty({
    required: false,
    description: 'Filter blogs updated before this date (ISO string)'
  })
  @IsOptional()
  @IsDateString()
  readonly updatedTo?: string

  @ApiProperty({
    required: false,
    description: 'Filter blogs with view count greater than or equal to this value'
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  readonly viewCountMin?: number

  @ApiProperty({
    required: false,
    description: 'Filter blogs with view count less than or equal to this value'
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  readonly viewCountMax?: number

  @ApiProperty({
    required: false,
    description: 'Field to sort by',
    enum: ['title', 'createdAt', 'updatedAt', 'viewCount', 'status']
  })
  @IsOptional()
  @IsString()
  readonly sortBy?: 'title' | 'createdAt' | 'updatedAt' | 'viewCount' | 'status'
}
