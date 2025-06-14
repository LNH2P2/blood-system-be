import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common'
import { LocalFilesService } from './local-files.service'
import { CreateLocalFileDto } from './dto/create-local-file.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBody, ApiConsumes } from '@nestjs/swagger'
import { Public } from '@decorators/public.decorator'

@Controller('local-files')
@Public() //TODO: remove this decorator -- it is for testing purposes only
export class LocalFilesController {
  constructor(private readonly localFilesService: LocalFilesService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateLocalFileDto })
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile()
    file: Express.Multer.File
  ) {
    return await this.localFilesService.create({ file })
  }
}
