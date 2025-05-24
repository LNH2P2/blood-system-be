import { Test, TestingModule } from '@nestjs/testing';
import { DonationMatchController } from './donation-match.controller';
import { DonationMatchService } from './donation-match.service';

describe('DonationMatchController', () => {
  let controller: DonationMatchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DonationMatchController],
      providers: [DonationMatchService],
    }).compile();

    controller = module.get<DonationMatchController>(DonationMatchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
