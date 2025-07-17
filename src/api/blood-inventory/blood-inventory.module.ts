import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { BloodInventoryService } from './blood-inventory.service'
import { BloodInventoryController } from './blood-inventory.controller'
import { BloodInventoryItem, BloodInventoryItemSchema } from './schemas/blood-inventory-item.schema'
import { Hospital, HospitalSchema } from '@api/hospital/schemas/hospital.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BloodInventoryItem.name, schema: BloodInventoryItemSchema },
      { name: Hospital.name, schema: HospitalSchema }
    ])
  ],
  controllers: [BloodInventoryController],
  providers: [BloodInventoryService],
  exports: [BloodInventoryService]
})
export class BloodInventoryModule {}
