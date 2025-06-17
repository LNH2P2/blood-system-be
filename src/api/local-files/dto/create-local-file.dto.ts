import { ApiProperty } from '@nestjs/swagger'

export class CreateLocalFileDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any
}
