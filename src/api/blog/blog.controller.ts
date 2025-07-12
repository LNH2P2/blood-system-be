import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import { BlogService } from './blog.service'
import { CreateBlogDto } from './dto/create-blog.dto'
import { UpdateBlogDto } from './dto/update-blog.dto'
import { Public } from '@decorators/public.decorator'
import { ListBlogReqDto } from './dto/list-blog.req.dto'
import { ApiOkResponse, ApiOperation, ApiQuery } from '@nestjs/swagger'
import { RESPONSE_MESSAGES } from '@constants/response-messages.constant'
import { ResponseMessage } from '@decorators/response-message.decorator'

@Controller('blog')
@Public() //TODO: Remove this decorator -- it's for testing purposes
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
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
    console.log(`listBlogDto at blog.controller.ts is: `, listBlogReqDto)
    return this.blogService.findAll(listBlogReqDto)
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
