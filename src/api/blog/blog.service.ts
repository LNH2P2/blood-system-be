import { Injectable } from '@nestjs/common'
import { CreateBlogDto } from './dto/create-blog.dto'
import { UpdateBlogDto } from './dto/update-blog.dto'
import { Blog, BlogDocument } from './schema/blog.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

@Injectable()
export class BlogService {
  constructor(@InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>) {}

  create(createBlogDto: CreateBlogDto) {
    return this.blogModel.create(createBlogDto)
  }

  findAll() {
    return this.blogModel.find()
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
