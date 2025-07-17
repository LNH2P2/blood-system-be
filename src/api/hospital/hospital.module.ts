import { AuthModule } from '@api/auth/auth.module'
import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { HospitalController } from './hospital.controller'
import { HospitalService } from './hospital.service'
import { BloodInventoryItem, BloodInventoryItemSchema } from '@api/blood-inventory/schemas/blood-inventory-item.schema'
import { Hospital, HospitalSchema } from './schemas/hospital.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Hospital.name, schema: HospitalSchema },
      { name: BloodInventoryItem.name, schema: BloodInventoryItemSchema }
    ]),
    forwardRef(() => AuthModule) // Forward reference to AuthModule for circular dependency resolution
  ],
  controllers: [HospitalController],
  providers: [HospitalService],
  exports: [HospitalService, MongooseModule.forFeature([{ name: Hospital.name, schema: HospitalSchema }])]
})
export class HospitalModule {}
