import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'
import { BlogStatus } from '../blog.constants'

export class CreateBlogDto {
  @ApiProperty({
    description: 'The title of the blog',
    example: 'My First Blog'
  })
  title: string

  @ApiProperty({
    description: 'The image of the blog',
    example: 'https://example.com/image.jpg'
  })
  image: string

  @ApiProperty({
    description: 'The summary of the blog',
    example: 'This is the summary of my first blog'
  })
  summary: string

  @ApiProperty({
    description: 'The content of the blog',
    example: 'This is the content of my first blog'
  })
  content: string

  @ApiProperty({
    description: 'The status of the blog',
    example: BlogStatus.DRAFT,
    required: false,
    default: BlogStatus.DRAFT
  })
  @IsOptional()
  status: BlogStatus = BlogStatus.DRAFT
}
