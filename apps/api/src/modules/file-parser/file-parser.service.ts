import { Injectable, BadRequestException } from '@nestjs/common';
import * as mammoth from 'mammoth';

export interface ExtractedFileResult {
  readonly filename: string;
  readonly characterCount: number;
  readonly extractedText: string;
}

@Injectable()
export class FileParserService {
  private readonly MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

  async parseFileBuffer(
    buffer: Buffer,
    originalName: string,
    mimeType?: string,
  ): Promise<ExtractedFileResult> {
    if (!buffer || buffer.length === 0) {
      throw new BadRequestException('Empty file buffer provided');
    }

    if (buffer.length > this.MAX_FILE_SIZE_BYTES) {
      throw new BadRequestException('File size exceeds maximum allowed limit of 5MB');
    }

    const lowerName = originalName.toLowerCase();
    let extractedText = '';

    if (lowerName.endsWith('.txt') || mimeType === 'text/plain') {
      extractedText = buffer.toString('utf-8');
    } else if (
      lowerName.endsWith('.docx') ||
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      try {
        const result = await mammoth.extractRawText({ buffer });
        extractedText = result.value || '';
      } catch (err) {
        throw new BadRequestException(`Failed to parse .docx document: ${String(err)}`);
      }
    } else {
      throw new BadRequestException('Unsupported file format. Only .txt and .docx files are allowed.');
    }

    const cleanedText = extractedText.replace(/\0/g, '').trim();

    return {
      filename: originalName,
      characterCount: cleanedText.length,
      extractedText: cleanedText,
    };
  }
}
