import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
  ValidateNested
} from 'class-validator'
import { BloodComponent, BloodType } from '../../../constants/hospital.constant'

export class ContactInfoDto {
  @ApiProperty({ description: 'Hospital phone number', example: '0123456789' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(\+84|0)[0-9]{9,10}$/, { message: 'Invalid Vietnamese phone number format' })
  phone: string

  @ApiPropertyOptional({ description: 'Hospital email address', example: 'info@hospital.com' })
  @IsOptional()
  @IsEmail()
  email?: string
}

export class CoordinatesDto {
  @ApiProperty({ description: 'Latitude coordinate', minimum: -90, maximum: 90, example: 10.123456 })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number

  @ApiProperty({ description: 'Longitude coordinate', minimum: -180, maximum: 180, example: 105.123456 })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number
}

export class BloodInventoryItemDto {
  @ApiProperty({ enum: BloodType, description: 'Blood type', example: BloodType.AB_POSITIVE })
  @IsEnum(BloodType)
  bloodType: BloodType

  @ApiProperty({ enum: BloodComponent, description: 'Blood component type', example: BloodComponent.RED_CELLS })
  @IsEnum(BloodComponent)
  component: BloodComponent

  @ApiProperty({ description: 'Quantity in units', minimum: 0 })
  @IsNumber()
  @Min(0)
  quantity: number

  @ApiProperty({ description: 'Expiration date', example: '2025-12-31T23:59:59Z' })
  @IsDate()
  @Type(() => Date)
  expiresAt: Date
}

export class CreateHospitalDto {
  @ApiProperty({ description: 'Hospital name' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ description: 'Hospital address' })
  @IsString()
  @IsNotEmpty()
  address: string

  @ApiProperty({ description: 'Province/City' })
  @IsString()
  @IsNotEmpty()
  province: string

  @ApiProperty({ description: 'District' })
  @IsString()
  @IsNotEmpty()
  district: string

  @ApiProperty({ description: 'Ward/Commune' })
  @IsString()
  @IsNotEmpty()
  ward: string

  @ApiProperty({ type: ContactInfoDto, description: 'Contact information' })
  @ValidateNested()
  @Type(() => ContactInfoDto)
  contactInfo: ContactInfoDto

  @ApiPropertyOptional({ description: 'Operating hours', default: '07:00 - 17:00' })
  @IsOptional()
  @IsString()
  operatingHours?: string

  @ApiProperty({ type: [String], description: 'List of medical services' })
  @IsArray()
  @IsString({ each: true })
  services: string[]

  @ApiPropertyOptional({
    type: [BloodInventoryItemDto],
    description: 'Blood inventory items'
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BloodInventoryItemDto)
  bloodInventory?: BloodInventoryItemDto[]

  @ApiProperty({ description: 'Emergency contact information' })
  @IsString()
  @IsNotEmpty()
  emergencyContact: string

  @ApiProperty({ description: 'Hospital description' })
  @IsString()
  @IsNotEmpty()
  description: string

  @ApiProperty({ type: CoordinatesDto, description: 'Geographic coordinates' })
  @ValidateNested()
  @Type(() => CoordinatesDto)
  coordinates: CoordinatesDto

  @ApiPropertyOptional({ description: 'License number' })
  @IsOptional()
  @IsString()
  licenseNumber?: string

  @ApiPropertyOptional({ description: 'Established date' })
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  establishedDate?: Date

  @ApiPropertyOptional({ description: 'Active status', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}
