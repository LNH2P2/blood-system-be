import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { HospitalService } from './hospital.service'
import { HospitalController } from './hospital.controller'
import { Hospital, HospitalSchema } from './schemas/hospital.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: Hospital.name, schema: HospitalSchema }])],
  controllers: [HospitalController],
  providers: [HospitalService],
  exports: [HospitalService, MongooseModule.forFeature([{ name: Hospital.name, schema: HospitalSchema }])]
})
export class HospitalModule {}
