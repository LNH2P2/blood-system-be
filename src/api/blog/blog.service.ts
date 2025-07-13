import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { CreateBlogDto } from './dto/create-blog.dto'
import { UpdateBlogDto } from './dto/update-blog.dto'
import { Blog, BlogDocument } from './schemas/blog.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Model, FilterQuery, isValidObjectId, Types } from 'mongoose'
import { ListBlogReqDto } from './dto/list-blog.req.dto'
import { PaginationUtil } from '@utils/pagination.util'
import { BlogStatus } from './blog.constants'

@Injectable()
export class BlogService {
  constructor(@InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>) {}

  async create(createBlogDto: CreateBlogDto) {
    try {
      const blog = await this.blogModel.create(createBlogDto)
      return blog
    } catch (error) {
      throw new BadRequestException('Failed to create blog')
    }
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

  async findOne(id: string) {
    // Validate ObjectId
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid blog ID format')
    }

    // Convert string to ObjectId
    const objectId = new Types.ObjectId(id)
    const blog = await this.blogModel.findById(objectId)

    if (!blog) {
      throw new NotFoundException(`Blog with ID ${id} not found`)
    }

    return blog
  }

  async update(id: string, updateBlogDto: UpdateBlogDto) {
    // Validate ObjectId
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid blog ID format')
    }

    // Convert string to ObjectId
    const objectId = new Types.ObjectId(id)
    const blog = await this.blogModel.findByIdAndUpdate(objectId, updateBlogDto, {
      new: true,
      runValidators: true
    })

    if (!blog) {
      throw new NotFoundException(`Blog with ID ${id} not found`)
    }

    return blog
  }

  async remove(id: string) {
    console.log('Before deleting blog ID:', id)

    // Validate ObjectId
    if (!isValidObjectId(id)) {
      console.log('Invalid ObjectId format:', id)
      throw new BadRequestException('Invalid blog ID format')
    }

    // Convert string to ObjectId
    const objectId = new Types.ObjectId(id)

    // Check if blog exists first
    const existingBlog = await this.blogModel.findById(objectId)
    if (!existingBlog) {
      console.log('Blog not found for deletion:', id)
      throw new NotFoundException(`Blog with ID ${id} not found`)
    }

    console.log('Found blog to delete:', { id: existingBlog._id, title: existingBlog.title })

    // Delete the blog
    const deletedBlog = await this.blogModel.findByIdAndDelete(objectId)

    if (!deletedBlog) {
      console.log('Failed to delete blog:', id)
      throw new BadRequestException('Failed to delete blog')
    }

    console.log('Successfully deleted blog:', { id: deletedBlog._id, title: deletedBlog.title })

    return {
      message: 'Blog deleted successfully',
      deletedBlog: {
        id: deletedBlog._id,
        title: deletedBlog.title
      }
    }
  }
}
