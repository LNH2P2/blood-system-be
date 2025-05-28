import { DonationRequestController } from '@api/donation-request/donation-request.controller'
import { DonationRequestService } from '@api/donation-request/donation-request.service'
import { Test, TestingModule } from '@nestjs/testing'

describe('DonationMatchController', () => {
  let controller: DonationRequestController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DonationRequestController],
      providers: [DonationRequestService]
    }).compile()

    controller = module.get<DonationRequestController>(DonationRequestController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
