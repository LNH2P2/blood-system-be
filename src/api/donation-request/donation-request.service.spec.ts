import { DonationRequestService } from '@api/donation-request/donation-request.service'
import { Test, TestingModule } from '@nestjs/testing'

describe('DonationMatchService', () => {
  let service: DonationRequestService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DonationRequestService]
    }).compile()

    service = module.get<DonationRequestService>(DonationRequestService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
