import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { LanguageToolService } from './services/languagetool.service';
import { HeuristicsService } from './services/heuristics.service';
import { PaginationService } from './services/pagination.service';
import { StatsService } from '../stats/stats.service';
import { CheckTextDto } from './dto/check-text.dto';
import { CheckTextResponse, TextIssue, IssueCategory } from '../../common/types/domain';

@Injectable()
export class TextEngineService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly languageTool: LanguageToolService,
    private readonly heuristics: HeuristicsService,
    private readonly pagination: PaginationService,
    private readonly statsService: StatsService,
  ) {}

  async processText(
    dto: CheckTextDto,
    isGuest: boolean = true,
    userId?: string,
  ): Promise<CheckTextResponse> {
    const maxChars = isGuest ? 1200 : 50000;
    if (dto.text.length > maxChars) {
      throw new BadRequestException({
        statusCode: 400,
        errorCode: 'QUOTA_EXCEEDED',
        message: `Character limit exceeded. Max allowed for ${
          isGuest ? 'guest' : 'authenticated user'
        } is ${maxChars} characters.`,
      });
    }

    const rawMatches = await this.languageTool.checkText(dto.text, dto.language || 'uk');

    const externalIssues: TextIssue[] = rawMatches.map((match, idx) => {
      let category: IssueCategory = 'spelling';
      const catId = match.rule?.category?.id?.toLowerCase() || '';

      if (catId.includes('grammar')) {
        category = 'grammar';
      } else if (catId.includes('style')) {
        category = 'style';
      } else if (catId.includes('typography')) {
        category = 'typography';
      }

      return {
        id: `lt-${idx}-${match.offset}`,
        message: match.message,
        offset: match.offset,
        length: match.length,
        category,
        ruleId: match.rule?.id || 'UNKNOWN_RULE',
        replacements: match.replacements || [],
      };
    });

    const userRules = userId
      ? await this.prisma.dictionaryRule.findMany({ where: { userId } })
      : [];

    const filteredIssues = externalIssues.filter((issue) => {
      const issueSubstr = dto.text.substring(issue.offset, issue.offset + issue.length).toLowerCase();

      return !userRules.some((rule) => {
        if (rule.ruleId && rule.ruleId === issue.ruleId) {
          return true;
        }
        if (rule.wordPattern && issueSubstr.includes(rule.wordPattern.toLowerCase())) {
          return true;
        }
        return false;
      });
    });

    const heuristicIssues = this.heuristics.analyzeTypography(dto.text);
    const combinedIssues = [...filteredIssues, ...heuristicIssues].sort((a, b) => a.offset - b.offset);

    const sliced = this.pagination.paginate(
      dto.text,
      combinedIssues,
      dto.pageIndex || 0,
      dto.pageSize || 2500,
    );

    const wordsCount = dto.text.trim() ? dto.text.trim().split(/\s+/).length : 0;

    void this.statsService.recordCheckMetrics(dto.text.length, combinedIssues);

    return {
      pageIndex: sliced.pageIndex,
      totalPages: sliced.totalPages,
      issues: sliced.pageIssues,
      metrics: {
        characterCount: dto.text.length,
        wordCount: wordsCount,
      },
    };
  }
}
