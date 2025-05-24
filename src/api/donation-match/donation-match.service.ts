import { Injectable } from '@nestjs/common';
import { CreateDonationMatchDto } from './dto/create-donation-match.dto';
import { UpdateDonationMatchDto } from './dto/update-donation-match.dto';
import {  DonationMatch, DonationMatchDocument } from '@api/donation-match/schemas/donation-match.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class DonationMatchService {
  constructor(@InjectModel(DonationMatch.name) private donationMatchModel: Model<DonationMatchDocument>) {}
  create(createDonationMatchDto: CreateDonationMatchDto) {
    // 1. check trong ngân hàng máu còn máu phù hợp với request không
    
    // 2.1 nếu có thì update lại số lượng máu trong ngân hàng máu

    // 2.2 nếu không thì tạo mới một donation match

    // 3. tạo mới một donation match 
    return this.donationMatchModel.create(createDonationMatchDto);
  }

  findAll() {
    return `This action returns all donationMatch`;
  }

  findOne(id: number) {
    return `This action returns a #${id} donationMatch`;
  }

  update(id: number, updateDonationMatchDto: UpdateDonationMatchDto) {
    return `This action updates a #${id} donationMatch`;
  }

  remove(id: number) {
    return `This action removes a #${id} donationMatch`;
  }
}
