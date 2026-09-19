import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { FileParserService } from './file-parser.service';

describe('FileParserService', () => {
  let service: FileParserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileParserService],
    }).compile();

    service = module.get<FileParserService>(FileParserService);
  });

  it('should extract text from .txt buffer', async () => {
    const text = 'Sample plaintext content';
    const buffer = Buffer.from(text, 'utf-8');

    const result = await service.parseFileBuffer(buffer, 'document.txt', 'text/plain');
    expect(result.extractedText).toBe(text);
    expect(result.characterCount).toBe(text.length);
  });

  it('should throw BadRequestException if file exceeds 5MB', async () => {
    const largeBuffer = Buffer.alloc(5 * 1024 * 1024 + 1);
    await expect(
      service.parseFileBuffer(largeBuffer, 'large.txt', 'text/plain'),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException for unsupported file format', async () => {
    const buffer = Buffer.from('data', 'utf-8');
    await expect(
      service.parseFileBuffer(buffer, 'image.png', 'image/png'),
    ).rejects.toThrow(BadRequestException);
  });
});
