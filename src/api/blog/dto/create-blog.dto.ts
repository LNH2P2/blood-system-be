import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsEnum, IsString, IsNotEmpty } from 'class-validator'
import { BlogStatus } from '../blog.constants'

export class CreateBlogDto {
  @ApiProperty({
    description: 'The title of the blog',
    example: 'My First Blog'
  })
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiProperty({
    description: 'The image of the blog',
    example: 'https://example.com/image.jpg'
  })
  @IsString()
  @IsOptional()
  image: string

  @ApiProperty({
    description: 'The summary of the blog',
    example: 'This is the summary of my first blog'
  })
  @IsString()
  @IsNotEmpty()
  summary: string

  @ApiProperty({
    description: 'The content of the blog',
    example: 'This is the content of my first blog'
  })
  @IsString()
  @IsNotEmpty()
  content: string

  @ApiProperty({
    description: 'The status of the blog',
    example: BlogStatus.DRAFT,
    required: false,
    default: BlogStatus.DRAFT
  })
  @IsOptional()
  @IsEnum(BlogStatus)
  status: BlogStatus = BlogStatus.DRAFT
}
