import { Test, TestingModule } from '@nestjs/testing'
import { DonationMatchService } from './donation-match.service'

describe('DonationMatchService', () => {
  let service: DonationMatchService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DonationMatchService]
    }).compile()

    service = module.get<DonationMatchService>(DonationMatchService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
