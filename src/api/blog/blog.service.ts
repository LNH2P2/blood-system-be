import { Injectable } from '@nestjs/common'
import { CreateBlogDto } from './dto/create-blog.dto'
import { UpdateBlogDto } from './dto/update-blog.dto'
import { Blog, BlogDocument } from './schemas/blog.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ListBlogReqDto } from './dto/list-blog.req.dto'
import { PaginationUtil } from '@utils/pagination.util'
import { BlogStatus } from './blog.constants'

@Injectable()
export class BlogService {
  constructor(@InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>) {}

  create(createBlogDto: CreateBlogDto) {
    return this.blogModel.create(createBlogDto)
  }

  async findAll(listBlogReqDto: ListBlogReqDto) {
    // Get paginated results
    const paginatedResult = await PaginationUtil.paginate({
      model: this.blogModel,
      pageOptions: listBlogReqDto,
      searchFields: ['title', 'summary', 'content'],
      sortField: 'createdAt',
      filter: {}
    })

    // Get status counts using aggregation
    const statusCounts = await this.blogModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ])

    // Initialize counts for all statuses
    const statusCountsMap = {
      [BlogStatus.DRAFT]: 0,
      [BlogStatus.PUBLISHED]: 0,
      [BlogStatus.ARCHIVED]: 0,
      [BlogStatus.PRIVATE]: 0
    }

    // Map aggregation results to the initialized object
    statusCounts.forEach((item) => {
      if (item._id && item._id in statusCountsMap) {
        statusCountsMap[item._id] = item.count
      }
    })

    // Return both paginated data and status counts
    return {
      ...paginatedResult,
      statusCounts: statusCountsMap
    }
  }

  findOne(id: string) {
    return this.blogModel.findById(id)
  }

  update(id: string, updateBlogDto: UpdateBlogDto) {
    return this.blogModel.findByIdAndUpdate(id, updateBlogDto, { new: true })
  }

  remove(id: string) {
    return this.blogModel.findByIdAndDelete(id)
  }
}
