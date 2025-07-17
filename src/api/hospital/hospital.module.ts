import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { HospitalService } from './hospital.service'
import { HospitalController } from './hospital.controller'
import { Hospital, HospitalSchema } from './schemas/hospital.schema'
import { HospitalStaff, HospitalStaffSchema } from './schemas/hospital-staff.schema'
import { BloodInventoryItem, BloodInventoryItemSchema } from '@api/blood-inventory/schemas/blood-inventory-item.schema'
import { AuthModule } from '@api/auth/auth.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Hospital.name, schema: HospitalSchema },
      { name: HospitalStaff.name, schema: HospitalStaffSchema },
      { name: BloodInventoryItem.name, schema: BloodInventoryItemSchema }
    ]),
    AuthModule
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
