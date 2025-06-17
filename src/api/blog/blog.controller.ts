import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { BlogService } from './blog.service'
import { CreateBlogDto } from './dto/create-blog.dto'
import { UpdateBlogDto } from './dto/update-blog.dto'
import { Public } from '@decorators/public.decorator'

@Controller('blog')
@Public() //TODO: Remove this decorator -- it's for testing purposes
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  create(@Body() createBlogDto: CreateBlogDto) {
    return this.blogService.create(createBlogDto)
  }

  @Get()
  findAll() {
    return this.blogService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogService.update(id, updateBlogDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogService.remove(id)
  }
}
