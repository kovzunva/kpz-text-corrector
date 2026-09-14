import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { TextEngineService } from './text-engine.service';
import { LanguageToolService } from './services/languagetool.service';
import { HeuristicsService } from './services/heuristics.service';
import { PaginationService } from './services/pagination.service';
import { PrismaService } from '../../common/prisma/prisma.service';

describe('TextEngineService', () => {
  let service: TextEngineService;

  const mockPrismaService = {
    dictionaryRule: {
      findMany: jest.fn().mockResolvedValue([]),
    },
  };

  const mockLanguageToolService = {
    checkText: jest.fn().mockResolvedValue([
      {
        message: 'Spelling error found',
        offset: 0,
        length: 4,
        replacements: [{ value: 'Test' }],
        rule: { id: 'SPELLING_RULE', category: { id: 'TYPOS' } },
      },
    ]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TextEngineService,
        HeuristicsService,
        PaginationService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: LanguageToolService, useValue: mockLanguageToolService },
      ],
    }).compile();

    service = module.get<TextEngineService>(TextEngineService);
  });

  it('should throw BadRequestException if guest exceeds 1200 characters', async () => {
    const longText = 'a'.repeat(1201);
    await expect(service.processText({ text: longText }, true)).rejects.toThrow(BadRequestException);
  });

  it('should process guest text under 1200 characters', async () => {
    const res = await service.processText({ text: 'Test text -- sample' }, true);
    expect(res.metrics.characterCount).toBe(19);
    expect(res.issues.length).toBeGreaterThan(0);
  });

  it('should suppress issues matching user dictionary rules', async () => {
    mockPrismaService.dictionaryRule.findMany.mockResolvedValueOnce([
      { id: '1', userId: 'user-1', wordPattern: '', ruleId: 'SPELLING_RULE', createdAt: new Date() },
    ]);

    const res = await service.processText({ text: 'Test text' }, false, 'user-1');
    const spellingIssues = res.issues.filter((i) => i.ruleId === 'SPELLING_RULE');
    expect(spellingIssues.length).toBe(0);
  });
});
