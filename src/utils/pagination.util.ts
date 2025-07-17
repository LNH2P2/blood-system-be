import { Model, Document, FilterQuery, SortOrder, PopulateOptions } from 'mongoose'
import { PageOptionsDto } from '@common/dto/offset-pagination/page-options.dto'
import { OffsetPaginatedDto } from '@common/dto/offset-pagination/paginated.dto'
import { OffsetPaginationDto } from '@common/dto/offset-pagination/offset-pagination.dto'

export interface PaginationOptions<T> {
  model: Model<any>
  pageOptions: PageOptionsDto
  filter?: FilterQuery<T>
  searchFields?: string[]
  sortField?: string
  message?: string
  populate?: PopulateOptions | (string | PopulateOptions)[]
}

export class PaginationUtil {
  /**
   * Generic function to handle offset pagination for any MongoDB model
   * @param options - Configuration object for pagination
   * @returns Promise<OffsetPaginatedDto<T>>
   */ static async paginate<T extends Document>(options: PaginationOptions<T>): Promise<OffsetPaginatedDto<T>> {
    const {
      model,
      pageOptions,
      filter = {},
      searchFields = [],
      sortField = 'createdAt',
      message = 'Data retrieved successfully',
      populate
    } = options

    const queryFilter: FilterQuery<T> = { ...filter }

    if (pageOptions.q && searchFields.length > 0) {
      queryFilter.$or = searchFields.map((field) => ({
        [field]: { $regex: pageOptions.q, $options: 'i' }
      })) as any
    }

    const totalRecords = await model.countDocuments(queryFilter)

    const sortOrder: SortOrder = pageOptions.order === 'ASC' ? 1 : -1
    const sortOptions: { [key: string]: SortOrder } = { [sortField]: sortOrder }

    let query = model.find(queryFilter).skip(pageOptions.offset).limit(pageOptions.limit).sort(sortOptions)

    // Add populate if provided
    if (populate) {
      query = query.populate(populate)
    }

    const data = await query.exec()

    const meta = new OffsetPaginationDto(totalRecords, pageOptions)

    return new OffsetPaginatedDto({
      data,
      meta,
      message,
      statusCode: 200
    })
  }

  /**
   * Simple count function for any model with optional filter
   * @param model - Mongoose model
   * @param filter - Optional filter query
   * @returns Promise<number>
   */
  static async count<T extends Document>(model: Model<T>, filter: FilterQuery<T> = {}): Promise<number> {
    return await model.countDocuments(filter)
  }

  /**
   * Build search filter for multiple fields
   * @param searchQuery - Search string
   * @param fields - Array of field names to search in
   * @returns FilterQuery object
   */
  static buildSearchFilter<T>(searchQuery: string, fields: string[]): FilterQuery<T> {
    if (!searchQuery || fields.length === 0) {
      return {}
    }

    return {
      $or: fields.map((field) => ({
        [field]: { $regex: searchQuery, $options: 'i' }
      }))
    } as FilterQuery<T>
  }
}
