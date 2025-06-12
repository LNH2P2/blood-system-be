import { Module } from '@nestjs/common';
import { LocalFilesService } from './local-files.service';
import { LocalFilesController } from './local-files.controller';

@Module({
  controllers: [LocalFilesController],
  providers: [LocalFilesService],
})
export class LocalFilesModule {}
