import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { HospitalService } from './hospital.service'
import { HospitalController } from './hospital.controller'
import { Hospital, HospitalSchema } from './schemas/hospital.schema'
import { HospitalStaff, HospitalStaffSchema } from './schemas/hospital-staff.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Hospital.name, schema: HospitalSchema },
      { name: HospitalStaff.name, schema: HospitalStaffSchema }
    ])
  ],
  controllers: [HospitalController],
  providers: [HospitalService],
  exports: [
    HospitalService,
    MongooseModule.forFeature([
      { name: Hospital.name, schema: HospitalSchema },
      { name: HospitalStaff.name, schema: HospitalStaffSchema }
    ])
  ]
})
export class HospitalModule {}
