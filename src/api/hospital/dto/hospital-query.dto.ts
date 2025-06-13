import { IsOptional, IsString, IsEnum, IsBoolean, IsNumber, Min } from 'class-validator'
import { Type, Transform } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { BloodType, BloodComponent, HospitalStatus } from '../../../constants/hospital.constant'

export class HospitalQueryDto {
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

  @ApiPropertyOptional({ enum: BloodType, description: 'Filter by available blood type' })
  @IsOptional()
  @IsEnum(BloodType)
  bloodType?: BloodType

  @ApiPropertyOptional({ enum: BloodComponent, description: 'Filter by blood component' })
  @IsOptional()
  @IsEnum(BloodComponent)
  component?: BloodComponent

  @ApiPropertyOptional({
    enum: HospitalStatus,
    description: 'Filter by status (admin only)'
  })
  @IsOptional()
  @IsEnum(HospitalStatus)
  status?: HospitalStatus

  @ApiPropertyOptional({ description: 'Filter by active status' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true
    if (value === 'false') return false
    return value
  })
  isActive?: boolean

  @ApiPropertyOptional({ description: 'Page number', default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1

  @ApiPropertyOptional({ description: 'Items per page', default: 10, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10

  @ApiPropertyOptional({
    description: 'Sort field',
    enum: ['name', 'createdAt', 'updatedAt'],
    default: 'createdAt'
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt'

  @ApiPropertyOptional({
    description: 'Sort order',
    enum: ['asc', 'desc'],
    default: 'desc'
  })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc'
}
