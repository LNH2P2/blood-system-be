import { IsOptional, IsString, IsEnum, IsBoolean, IsNumber, Min, Max, Length, Matches, IsArray } from 'class-validator'
import { Transform, Type } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { BloodType, BloodComponent } from '../../../constants/hospital.constant'
import { PageOptionsDto } from '@common/dto/offset-pagination/page-options.dto'

export class HospitalQueryDto extends PageOptionsDto {
  @ApiPropertyOptional({
    description: 'Search term for name, address, description',
    example: 'Bach Mai Hospital'
  })
  @IsOptional()
  @IsString()
  search?: string

  @ApiPropertyOptional({
    description: 'Filter by province',
    example: 'Ho Chi Minh'
  })
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-ZÀ-ỹ\s]+$/, { message: 'Province name must contain only letters and spaces' })
  province?: string

  @ApiPropertyOptional({ description: 'Filter by district' })
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-ZÀ-ỹ0-9\s]+$/, { message: 'District name must contain only letters, numbers and spaces' })
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

  @ApiPropertyOptional({
    description: 'Minimum quantity of blood required',
    minimum: 1,
    example: 5
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  minQuantity?: number

  @ApiPropertyOptional({
    description: 'Filter by active status',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true
    if (value === 'false') return false
    return value
  })
  isActive?: boolean

  @ApiPropertyOptional({
    description: 'Filter hospitals that are currently open',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  availableNow?: boolean

  @ApiPropertyOptional({
    description: 'Filter hospitals with emergency services',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  hasEmergencyServices?: boolean

  @ApiPropertyOptional({
    description: 'Filter by specific medical services',
    type: [String],
    example: ['Emergency Care', 'Blood Bank', 'ICU']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  services?: string[]

  @ApiPropertyOptional({
    description: 'Show hospitals with blood expiring within X days',
    minimum: 1,
    maximum: 30,
    example: 7
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(30)
  @Type(() => Number)
  expiringWithinDays?: number
}
