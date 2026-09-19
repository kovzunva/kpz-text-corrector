import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  ForbiddenException,
  Headers,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileParserService, ExtractedFileResult } from './file-parser.service';

export interface MulterFile {
  readonly originalname: string;
  readonly mimetype: string;
  readonly buffer: Buffer;
  readonly size: number;
}

@Controller('v1/files')
export class FileParserController {
  constructor(private readonly fileParser: FileParserService) {}

  @Post('extract')
  @UseInterceptors(FileInterceptor('file'))
  async extractText(
    @UploadedFile() file?: MulterFile,
    @Headers('x-guest') isGuestHeader?: string,
  ): Promise<ExtractedFileResult> {
    if (isGuestHeader === 'true' || isGuestHeader === '1') {
      throw new ForbiddenException('Document file upload is exclusive to registered accounts.');
    }

    if (!file) {
      throw new BadRequestException('No file uploaded in form field "file"');
    }

    return this.fileParser.parseFileBuffer(file.buffer, file.originalname, file.mimetype);
  }
}
