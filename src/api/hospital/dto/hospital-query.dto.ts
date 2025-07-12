import { IsOptional, IsString, IsEnum, IsBoolean } from 'class-validator'
import { Transform } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { BloodType, BloodComponent } from '../../../constants/hospital.constant'
import { PageOptionsDto } from '@common/dto/offset-pagination/page-options.dto'

export class HospitalQueryDto extends PageOptionsDto {
  @ApiPropertyOptional({ description: 'Search term for name, address, description' })
  @IsOptional()
  @IsString()
  search?: string

  @ApiPropertyOptional({ description: 'Filter by province' })
  @IsOptional()
  @IsString()
  province?: string

  @ApiPropertyOptional({ description: 'Filter by district' })
  @IsOptional()
  @IsString()
  district?: string

  @ApiPropertyOptional({ description: 'Filter by ward' })
  @IsOptional()
  @IsString()
  ward?: string

  @ApiPropertyOptional({
    enum: BloodType,
    description: 'Filter by available blood type',
    example: BloodType.AB_POSITIVE
  })
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsEnum(BloodType)
  bloodType?: BloodType

  @ApiPropertyOptional({
    enum: BloodComponent,
    description: 'Filter by blood component',
    example: BloodComponent.RED_CELLS
  })
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsEnum(BloodComponent)
  component?: BloodComponent

  @ApiPropertyOptional({ description: 'Filter by active status', example: true })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true
    if (value === 'false') return false
    return value
  })
  isActive?: boolean
}
