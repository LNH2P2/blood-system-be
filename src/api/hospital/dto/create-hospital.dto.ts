import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsDateString,
  ValidateNested,
  Min,
  Max,
  Matches
} from 'class-validator'
import { Type, Transform } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { BloodType, BloodComponent } from '../../../constants/hospital.constant'

export class ContactInfoDto {
  @ApiProperty({ description: 'Hospital phone number' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(\+84|0)[0-9]{9,10}$/, { message: 'Invalid Vietnamese phone number format' })
  phone: string

  @ApiPropertyOptional({ description: 'Hospital email address' })
  @IsOptional()
  @IsEmail()
  email?: string
}

export class CoordinatesDto {
  @ApiProperty({ description: 'Latitude coordinate', minimum: -90, maximum: 90 })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number

  @ApiProperty({ description: 'Longitude coordinate', minimum: -180, maximum: 180 })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number
}

export class BloodInventoryItemDto {
  @ApiProperty({ enum: BloodType, description: 'Blood type' })
  @IsEnum(BloodType)
  bloodType: BloodType

  @ApiProperty({ enum: BloodComponent, description: 'Blood component type' })
  @IsEnum(BloodComponent)
  component: BloodComponent

  @ApiProperty({ description: 'Quantity in units', minimum: 0 })
  @IsNumber()
  @Min(0)
  quantity: number

  @ApiProperty({ description: 'Expiration date (ISO string)' })
  @IsDateString()
  @Transform(({ value }) => new Date(value))
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

  @ApiPropertyOptional({ description: 'Established date (ISO string)' })
  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => new Date(value))
  establishedDate?: Date

  @ApiPropertyOptional({ description: 'Active status', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}
