import { Injectable } from '@nestjs/common'
import { CreateBlogDto } from './dto/create-blog.dto'
import { UpdateBlogDto } from './dto/update-blog.dto'
import { Blog, BlogDocument } from './schemas/blog.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Model, FilterQuery } from 'mongoose'
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
    // Build filter object based on query parameters
    const filter: FilterQuery<BlogDocument> = {}

    // Status filter
    if (listBlogReqDto.status) {
      filter.status = listBlogReqDto.status
    }

    // Date range filters
    if (listBlogReqDto.createdFrom || listBlogReqDto.createdTo) {
      filter.createdAt = {}
      if (listBlogReqDto.createdFrom) {
        filter.createdAt.$gte = new Date(listBlogReqDto.createdFrom)
      }
      if (listBlogReqDto.createdTo) {
        filter.createdAt.$lte = new Date(listBlogReqDto.createdTo)
      }
    }

    if (listBlogReqDto.updatedFrom || listBlogReqDto.updatedTo) {
      filter.updatedAt = {}
      if (listBlogReqDto.updatedFrom) {
        filter.updatedAt.$gte = new Date(listBlogReqDto.updatedFrom)
      }
      if (listBlogReqDto.updatedTo) {
        filter.updatedAt.$lte = new Date(listBlogReqDto.updatedTo)
      }
    }

    // View count filters
    if (listBlogReqDto.viewCountMin !== undefined || listBlogReqDto.viewCountMax !== undefined) {
      filter.viewCount = {}
      if (listBlogReqDto.viewCountMin !== undefined) {
        filter.viewCount.$gte = listBlogReqDto.viewCountMin
      }
      if (listBlogReqDto.viewCountMax !== undefined) {
        filter.viewCount.$lte = listBlogReqDto.viewCountMax
      }
    }

    // Determine sort field
    const sortField = listBlogReqDto.sortBy || 'createdAt'

    // Get paginated results with enhanced filtering
    const paginatedResult = await PaginationUtil.paginate({
      model: this.blogModel,
      pageOptions: listBlogReqDto,
      searchFields: ['title', 'summary', 'content'],
      sortField,
      filter
    })

    // Get status counts using aggregation (with same filters except status)
    const statusCountFilter = { ...filter }
    delete statusCountFilter.status // Remove status filter for counting all statuses

    const statusCounts = await this.blogModel.aggregate([
      ...(Object.keys(statusCountFilter).length > 0 ? [{ $match: statusCountFilter }] : []),
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ])

    // Get the latest updated blog (with same filters)
    const latestBlog = await this.blogModel.findOne(filter).sort({ updatedAt: -1 }).select('updatedAt').exec()

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

    // Return both paginated data, status counts, and latest updated timestamp
    return {
      ...paginatedResult,
      statusCounts: statusCountsMap,
      latestUpdatedAt: latestBlog?.updatedAt || null,
      appliedFilters: {
        status: listBlogReqDto.status,
        createdFrom: listBlogReqDto.createdFrom,
        createdTo: listBlogReqDto.createdTo,
        updatedFrom: listBlogReqDto.updatedFrom,
        updatedTo: listBlogReqDto.updatedTo,
        viewCountMin: listBlogReqDto.viewCountMin,
        viewCountMax: listBlogReqDto.viewCountMax,
        sortBy: sortField,
        searchQuery: listBlogReqDto.q
      }
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
