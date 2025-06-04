import { DEFAULT_CURRENT_PAGE, DEFAULT_PAGE_LIMIT, Order } from '@constants/app.constant'
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator'
import { Transform, Type } from 'class-transformer'

export class PageOptionsDto {
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  readonly limit: number = DEFAULT_PAGE_LIMIT

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  readonly page?: number = DEFAULT_CURRENT_PAGE

  @IsString()
  @IsOptional()
  readonly q?: string

  @IsEnum(Order)
  @IsOptional()
  @Transform(({ value }) => value?.toUpperCase())
  readonly order: Order = Order.DESC

  get offset() {
    return this.page ? (this.page - 1) * this.limit : 0
  }
}
