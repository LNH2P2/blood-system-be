import { Module } from '@nestjs/common';
import { DonationMatchService } from './donation-match.service';
import { DonationMatchController } from './donation-match.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DonationMatch, DonationMatchSchema } from '@api/donation-match/schemas/donation-match.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: DonationMatch.name, schema: DonationMatchSchema }])],
  controllers: [DonationMatchController],
  providers: [DonationMatchService],
})
export class DonationMatchModule {}
