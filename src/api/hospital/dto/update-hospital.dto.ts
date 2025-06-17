import { PartialType, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsOptional } from 'class-validator'
import { CreateHospitalDto } from './create-hospital.dto'
import { HospitalStatus } from '../../../constants/hospital.constant'

export class UpdateHospitalDto extends PartialType(CreateHospitalDto) {
  @ApiPropertyOptional({
    enum: HospitalStatus,
    description: 'Hospital verification status',
    example: HospitalStatus.ACTIVE
  })
  @IsOptional()
  @IsEnum(HospitalStatus)
  status?: HospitalStatus
}
