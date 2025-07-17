import { CreateDonationRequestDto } from '@api/donation-request/dto/create-donation-request.dto'
import { ListDonationReqDto } from '@api/donation-request/dto/list-donation.req.dto'
import { UpdateDonationRequestDto } from '@api/donation-request/dto/update-donation-request.dto'
import { DonationRequest, DonationRequestDocument } from '@api/donation-request/schemas/donation-request.schema'
import { Hospital, HospitalDocument } from '@api/hospital/schemas/hospital.schema'
import { DonationRequestStatus } from '@constants/donation.constant'
import { ErrorCode } from '@constants/error-code.constant'
import { ValidationException } from '@exceptions/validattion.exception'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { PaginationUtil } from 'src/utils/pagination.util'

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

  update(id: string, payload: UpdateDonationRequestDto) {
    return this.donationMatchModel.findByIdAndUpdate(id, payload, { new: true }).populate('hospitalId')
  }

  remove(id: string) {
    return this.donationMatchModel.findByIdAndDelete(id)
  }

  // Debug method to list hospitals
  async listHospitals() {
    const hospitals = await this.hospitalModel.find().limit(10)
    console.log('Available hospitals:', hospitals)
    return hospitals
  }

  async findAllHospital(reqDto: ListDonationReqDto & { priority?: string }) {
    // Thêm filter priority nếu có
    const filter: any = {}
    if (reqDto.priority) {
      filter.priority = reqDto.priority
    }
    console.log('findAllHospital filter:', filter)
    return await PaginationUtil.paginate({
      model: this.donationMatchModel,
      pageOptions: reqDto,
      searchFields: [],
      sortField: 'createdAt',
      filter,
      populate: { path: 'hospitalId' }
    })
  }

  async getDonationHistoryDetailed(year?: number) {
    try {
      const now = new Date()
      const currentYear = now.getFullYear()
      const targetYear = year ?? currentYear

      if (isNaN(targetYear) || targetYear < 2000 || targetYear > currentYear) {
        throw new BadRequestException(`Năm không hợp lệ: ${targetYear}`)
      }

      const match = {
        scheduleDate: {
          $gte: new Date(`${targetYear}-01-01T00:00:00Z`),
          $lte: new Date(`${targetYear}-12-31T23:59:59Z`)
        },
        status: 0,
        $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }]
      }

      const requests = await this.donationMatchModel.find(match).lean()

      // Danh sách đầy đủ nhóm máu
      const validBloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const

      type BloodTypeKey = (typeof validBloodTypes)[number]

      // Kiểu dữ liệu thống kê theo tháng
      type BloodStats = {
        month: string
        total: number
      } & Record<BloodTypeKey, number>

      const monthlyData: Record<string, BloodStats> = {}

      for (const req of requests) {
        const date = new Date(req.scheduleDate)
        const monthIndex = date.getMonth() // 0–11
        const monthKey = `Tháng ${monthIndex + 1}`
        const bloodTypeRaw = req.bloodType?.trim().toUpperCase()
        const quantity = typeof req.quantity === 'string' ? parseInt(req.quantity) : req.quantity

        if (!validBloodTypes.includes(bloodTypeRaw as BloodTypeKey) || isNaN(quantity)) {
          console.log('❗ Dữ liệu không hợp lệ bị bỏ qua:', {
            bloodType: req.bloodType,
            quantity: req.quantity
          })
          continue
        }

        const bloodType = bloodTypeRaw as BloodTypeKey

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = {
            month: monthKey,
            total: 0,
            'A+': 0,
            'A-': 0,
            'B+': 0,
            'B-': 0,
            'AB+': 0,
            'AB-': 0,
            'O+': 0,
            'O-': 0
          }
        }

        monthlyData[monthKey][bloodType] += quantity
        monthlyData[monthKey].total += quantity
      }

      const currentMonth = now.getMonth() + 1
      const last6Months: BloodStats[] = []

      for (let i = 5; i >= 0; i--) {
        let m = currentMonth - i
        if (m <= 0) m += 12 // vòng lại đầu năm
        const monthKey = `Tháng ${m}`
        const data = monthlyData[monthKey] ?? {
          month: monthKey,
          total: 0,
          'A+': 0,
          'A-': 0,
          'B+': 0,
          'B-': 0,
          'AB+': 0,
          'AB-': 0,
          'O+': 0,
          'O-': 0
        }
        last6Months.push(data)
      }

      return last6Months
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error
      }
      console.log('Error in getDonationHistoryDetailed:', error)
      throw new BadRequestException('Không thể lấy dữ liệu thống kê lịch sử hiến máu.')
    }
  }

  async getRequestStats() {
    const result = await this.donationMatchModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ])

    // Map _id (status) sang tên hiển thị
    const statusLabels = {
      [DonationRequestStatus.COMPLETED]: 'Đã xử lý',
      [DonationRequestStatus.SCHEDULED]: 'Đang chờ',
      [DonationRequestStatus.CANCELLED]: 'Đã hủy'
    }

    return result.map((item) => ({
      name: statusLabels[item._id] || item._id,
      value: item.count
    }))
  }

  async getMatchRateData(year: number) {
    const result = await this.donationMatchModel.aggregate([
      {
        $match: {
          status: DonationRequestStatus.COMPLETED,
          scheduleDate: {
            $gte: new Date(`${year}-01-01`),
            $lt: new Date(`${year + 1}-01-01`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$scheduleDate' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ])

    // Map tháng sang tên
    return result.map((item) => ({
      name: `Tháng ${item._id}`,
      value: item.count
    }))
  }

  async getDemandReport() {
    const result = await this.donationMatchModel.aggregate([
      {
        $group: {
          _id: '$bloodType',
          count: { $sum: 1 }
        }
      }
    ])

    return result.map((item) => ({
      name: item._id,
      value: item.count
    }))
  }

  async getPerformanceReport() {
    // Giả sử đếm số donation request, số yêu cầu máu, số tìm kiếm (cần có các collection/log phù hợp)
    const totalDonations = await this.donationMatchModel.countDocuments()
    const totalRequests = await this.donationMatchModel.countDocuments() // Hoặc một collection khác
    const totalSearches = 943 // Ví dụ số liệu tĩnh hoặc đếm log tìm kiếm nếu có

    return [
      { name: 'Hiến máu', value: totalDonations },
      { name: 'Yêu cầu máu', value: totalRequests },
      { name: 'Tìm kiếm', value: totalSearches }
    ]
  }

  async getIncidentReport() {
    const result = await this.donationMatchModel.aggregate([
      {
        $match: { incidentType: { $exists: true } }
      },
      {
        $group: {
          _id: '$incidentType',
          count: { $sum: 1 }
        }
      }
    ])

    // Map tên hiển thị theo từng loại sự cố
    const labels = {
      CANCELLED: 'Hủy lịch',
      WRONG_INFO: 'Sai thông tin',
      LATE: 'Trễ giờ'
    }

    return result.map((item) => ({
      name: labels[item._id] || item._id,
      value: item.count
    }))
  }
}
