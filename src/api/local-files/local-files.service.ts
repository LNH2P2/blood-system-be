import { Injectable } from '@nestjs/common'
import { CreateLocalFileDto } from './dto/create-local-file.dto'
import { ConfigService } from '@nestjs/config'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

@Injectable()
export class LocalFilesService {
  private readonly s3Client: S3Client

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({ region: this.configService.getOrThrow('AWS_S3_REGION') })
  }

  async create(createLocalFileDto: CreateLocalFileDto) {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.configService.getOrThrow('AWS_S3_BUCKET'),
        Key: createLocalFileDto.file.originalname,
        Body: createLocalFileDto.file.buffer,
        ContentType: createLocalFileDto.file.mimetype,
        ContentLength: createLocalFileDto.file.size,
        ACL: 'public-read',
        CacheControl: 'max-age=31536000'
      })
    )
    return `https://${this.configService.getOrThrow('AWS_S3_BUCKET')}.s3.${this.configService.getOrThrow('AWS_S3_REGION')}.amazonaws.com/${createLocalFileDto.file.originalname}`
  }

  // findAll() {
  //   return `This action returns all localFiles`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} localFile`;
  // }

  // update(id: number, updateLocalFileDto: UpdateLocalFileDto) {
  //   return `This action updates a #${id} localFile`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} localFile`;
  // }
}
