import { Injectable } from '@nestjs/common'
import { DonationRequest, DonationRequestDocument } from '@api/donation-request/schemas/donation-request.schema'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { CreateDonationRequestDto } from '@api/donation-request/dto/create-donation-request.dto'
import { UpdateDonationRequestDto } from '@api/donation-request/dto/update-donation-request.dto'
import { ListDonationReqDto } from '@api/donation-request/dto/list-donation.req.dto'
import { PaginationUtil } from 'src/utils/pagination.util'

@Injectable()
export class DonationRequestService {
  constructor(@InjectModel(DonationRequest.name) private donationMatchModel: Model<DonationRequestDocument>) {}

  async create(createDonationRequestDto: CreateDonationRequestDto) {
    return await this.donationMatchModel.create(createDonationRequestDto)
  }

  async findAll(reqDto: ListDonationReqDto) {
    return await PaginationUtil.paginate({
      model: this.donationMatchModel,
      pageOptions: reqDto,
      searchFields: [],
      sortField: 'createdAt'
    })
  }

  findOne(id: string) {
    return this.donationMatchModel.findById(id)
  }

  update(id: number, updateDonationMatchDto: UpdateDonationRequestDto) {
    return `This action updates a #${id} donationMatch`
  }

  remove(id: number) {
    return `This action removes a #${id} donationMatch`
  }
}
