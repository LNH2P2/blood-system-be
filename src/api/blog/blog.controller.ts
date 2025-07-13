import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import { BlogService } from './blog.service'
import { CreateBlogDto } from './dto/create-blog.dto'
import { UpdateBlogDto } from './dto/update-blog.dto'
import { Public } from '@decorators/public.decorator'
import { ListBlogReqDto } from './dto/list-blog.req.dto'
import { ApiOkResponse, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger'
import { RESPONSE_MESSAGES } from '@constants/response-messages.constant'
import { ResponseMessage } from '@decorators/response-message.decorator'

@Controller('blog')
@Public() //TODO: Remove this decorator -- it's for testing purposes
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new blog' })
  @ApiOkResponse({
    description: 'Blog created successfully'
  })
  @ResponseMessage(RESPONSE_MESSAGES.BLOG.CREATED || 'Blog created successfully')
  create(@Body() createBlogDto: CreateBlogDto) {
    return this.blogService.create(createBlogDto)
  }

  @Get()
  @ApiOperation({ summary: 'Get list blog' })
  @ApiOkResponse({
    description: 'Get list blog successfully'
  })
  @ApiQuery({ type: ListBlogReqDto })
  @ResponseMessage(RESPONSE_MESSAGES.BLOG.LIST)
  findAll(@Query() listBlogReqDto: ListBlogReqDto) {
    return this.blogService.findAll(listBlogReqDto)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get blog by ID' })
  @ApiParam({ name: 'id', description: 'Blog ID', type: 'string' })
  @ApiOkResponse({
    description: 'Blog retrieved successfully'
  })
  @ResponseMessage(RESPONSE_MESSAGES.BLOG.FOUND || 'Blog retrieved successfully')
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update blog by ID' })
  @ApiParam({ name: 'id', description: 'Blog ID', type: 'string' })
  @ApiOkResponse({
    description: 'Blog updated successfully'
  })
  @ResponseMessage(RESPONSE_MESSAGES.BLOG.UPDATED || 'Blog updated successfully')
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogService.update(id, updateBlogDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete blog by ID' })
  @ApiParam({ name: 'id', description: 'Blog ID', type: 'string' })
  @ApiOkResponse({
    description: 'Blog deleted successfully'
  })
  @ResponseMessage(RESPONSE_MESSAGES.BLOG.DELETED || 'Blog deleted successfully')
  remove(@Param('id') id: string) {
    return this.blogService.remove(id)
  }
}
