import { PageOptionsDto } from '@common/dto/offset-pagination/page-options.dto'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, IsEnum } from 'class-validator'
import { BloodType, BloodComponent } from '@constants/hospital.constant'

export class ListBloodInventoryDto extends PageOptionsDto {
  @ApiPropertyOptional({
    enum: BloodType,
    description: 'Filter by blood type',
    example: BloodType.A_POSITIVE
  })
  @IsOptional()
  @IsEnum(BloodType)
  bloodType?: BloodType

  @ApiPropertyOptional({
    enum: BloodComponent,
    description: 'Filter by blood component',
    example: BloodComponent.RED_CELLS
  })
  @IsOptional()
  @IsEnum(BloodComponent)
  component?: BloodComponent

  @ApiPropertyOptional({
    description: 'Filter by province/city',
    example: 'Hà Nội'
  })
  @IsOptional()
  @IsString()
  province?: string

  @ApiPropertyOptional({
    description: 'Filter by district',
    example: 'Cầu Giấy'
  })
  @IsOptional()
  @IsString()
  district?: string

  @ApiPropertyOptional({
    description: 'Filter by ward/commune',
    example: 'Dịch Vọng'
  })
  @IsOptional()
  @IsString()
  ward?: string

  @ApiPropertyOptional({
    description: 'Filter by hospital address (partial match)',
    example: 'Nguyễn Trãi'
  })
  @IsOptional()
  @IsString()
  address?: string
}
