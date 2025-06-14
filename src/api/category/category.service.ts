import { Injectable } from '@nestjs/common'
import { CreateCategoryDto } from './dto/create-category.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Category, CategoryDocument } from './schemas/category.schema'

@Injectable()
export class CategoryService {
  constructor(@InjectModel(Category.name) private readonly categoryModel: Model<CategoryDocument>) {}

  create(createCategoryDto: CreateCategoryDto) {
    return this.categoryModel.create(createCategoryDto)
  }

  findAll() {
    return `This action returns all category`
  }

  findOne(id: string) {
    return this.categoryModel.findById(id)
  }
}
