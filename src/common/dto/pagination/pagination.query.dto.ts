import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '@constant/app.constant'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt, IsOptional, Min } from 'class-validator'

export class PaginationQueryDto {
  @ApiProperty({
    required: false,
    description: 'Current page number, default: 1',
    default: DEFAULT_PAGE_NUMBER
  })
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'Current must be at least 1' })
  current: number

  @ApiProperty({
    required: false,
    description: 'Number of items per page, default: 10',
    default: DEFAULT_PAGE_SIZE
  })
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'limit must be at least 1' })
  limit: number

  @ApiProperty({
    required: false,
    description: 'Query string to filter, sort, paginate'
  })
  @IsOptional()
  qs?: string // Chuỗi query string để lọc, sắp xếp, phân trang
}
