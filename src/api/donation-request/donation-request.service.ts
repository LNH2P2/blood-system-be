import { Injectable } from '@nestjs/common'
import { DonationRequest, DonationRequestDocument } from '@api/donation-request/schemas/donation-request.schema'
import { Hospital, HospitalDocument } from '@api/hospital/schemas/hospital.schema'
import { Model, Types } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { CreateDonationRequestDto } from '@api/donation-request/dto/create-donation-request.dto'
import { UpdateDonationRequestDto } from '@api/donation-request/dto/update-donation-request.dto'
import { ListDonationReqDto } from '@api/donation-request/dto/list-donation.req.dto'
import { PaginationUtil } from 'src/utils/pagination.util'
import { ValidationException } from '@exceptions/validattion.exception'
import { ErrorCode } from '@constants/error-code.constant'

@Injectable()
export class DonationRequestService {
  constructor(
    @InjectModel(DonationRequest.name) private donationMatchModel: Model<DonationRequestDocument>,
    @InjectModel(Hospital.name) private hospitalModel: Model<HospitalDocument>
  ) {}
  async create(createDonationRequestDto: CreateDonationRequestDto) {
    const hospitalObjectId = new Types.ObjectId(createDonationRequestDto.hospitalId)

    const hospital = await this.hospitalModel.findById(hospitalObjectId)

    if (!hospital) {
      throw new ValidationException(ErrorCode.H001)
    }

    const requestData = {
      ...createDonationRequestDto,
      hospitalId: hospitalObjectId
    }

    const createdRequest = await this.donationMatchModel.create(requestData)
    const populatedRequest = await this.donationMatchModel.findById(createdRequest._id).populate('hospitalId')

    return populatedRequest
  }
  async findAll(userId: string, reqDto: ListDonationReqDto) {
    const filter = { userId: userId }
    return await PaginationUtil.paginate({
      model: this.donationMatchModel,
      pageOptions: reqDto,
      searchFields: [],
      sortField: 'createdAt',
      filter,
      populate: { path: 'hospitalId' }
    })
  }
  findOne(id: string) {
    return this.donationMatchModel.findById(id).populate('hospitalId')
  }

  update(payload: UpdateDonationRequestDto) {
    return this.donationMatchModel.findByIdAndUpdate(payload.id, payload, { new: true }).populate('hospitalId')
  }

  remove(id: number) {
    return `This action removes a  donationMatch`
  }

  // Debug method to list hospitals
  async listHospitals() {
    const hospitals = await this.hospitalModel.find().limit(10)
    console.log('Available hospitals:', hospitals)
    return hospitals
  }
}
