import { Module } from '@nestjs/common'

import { MongooseModule } from '@nestjs/mongoose'
import { DonationRequest, DonationRequestSchema } from '@api/donation-request/schemas/donation-request.schema'
import { Hospital, HospitalSchema } from '@api/hospital/schemas/hospital.schema'
import { DonationRequestController } from '@api/donation-request/donation-request.controller'
import { DonationRequestService } from '@api/donation-request/donation-request.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DonationRequest.name, schema: DonationRequestSchema },
      { name: Hospital.name, schema: HospitalSchema }
    ])
  ],
  controllers: [DonationRequestController],
  providers: [DonationRequestService]
})
export class DonationRequestModule {}
