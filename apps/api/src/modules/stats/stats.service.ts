import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { GlobalStatistics, TextIssue } from '../../common/types/domain';

const ENGLISH_RULE_DESCRIPTIONS: Record<string, string> = {
  UK_SIMPLE_REPLACE: 'Non-standard or archaic word spelling detected',
  MULTIPLE_SPACES: 'Multiple consecutive spaces used instead of a single space',
  TYPOGRAPHY_DOUBLE_SPACE: 'Multiple consecutive spaces used instead of a single space',
  DOUBLE_SPACE: 'Multiple consecutive spaces used instead of a single space',
  SPELLING_RULE: 'Spelling mistake or typo detected in word',
  UKRAINIAN_SPELLING: 'Non-standard language spelling detected',
  TYPOGRAPHY_EM_DASH: 'Hyphen (-) used instead of proper em dash (—)',
  TYPOGRAPHY_QUOTES: 'Straight quotes used instead of guillemets (« »)',
  PUNCTUATION_COMMA: 'Missing comma before conjunction or clause',
  STYLE_PASSIVE_VOICE: 'Passive verb construction; consider active phrasing',
  REDUNDANT_WORD: 'Redundant or duplicate word in sentence',
  CASE_AGREEMENT: 'Grammatical case or gender form mismatch',
  SPACE_PUNCTUATION: 'Extra space inserted before punctuation mark',
  CAPITALIZATION: 'Incorrect lowercase letter at start of sentence',
};

@Injectable()
export class StatsService {
  private readonly ruleOccurrencesMap = new Map<string, { count: number; description: string }>();

  constructor(private readonly prisma: PrismaService) {
    this.seedDefaultRuleDescriptions();
  }

  private seedDefaultRuleDescriptions(): void {
    Object.entries(ENGLISH_RULE_DESCRIPTIONS).forEach(([ruleId, description]) => {
      this.ruleOccurrencesMap.set(ruleId, { count: 0, description });
    });
  }

  async getGlobalStats(): Promise<GlobalStatistics> {
    const userCount = await this.prisma.user.count();
    const statsRow = await this.prisma.globalStats.findUnique({
      where: { id: 'global_metrics' },
    });

    const totalChars = statsRow ? Number(statsRow.totalCharactersChecked) : 0;
    const totalIssues = statsRow ? Number(statsRow.totalIssuesFound) : 0;

    const topIssues = Array.from(this.ruleOccurrencesMap.entries())
      .filter(([, data]) => data.count > 0)
      .map(([ruleId, data]) => ({
        ruleId,
        occurrences: data.count,
        description: ENGLISH_RULE_DESCRIPTIONS[ruleId] || data.description,
      }))
      .sort((a, b) => b.occurrences - a.occurrences)
      .slice(0, 10);

    return {
      totalUsers: userCount,
      totalCharactersChecked: totalChars,
      totalIssuesFound: totalIssues,
      topIssues,
    };
  }

  async recordCheckMetrics(charCount: number, issues: readonly TextIssue[]): Promise<void> {
    try {
      await this.prisma.globalStats.upsert({
        where: { id: 'global_metrics' },
        create: {
          id: 'global_metrics',
          totalCharactersChecked: BigInt(charCount),
          totalIssuesFound: BigInt(issues.length),
        },
        update: {
          totalCharactersChecked: { increment: charCount },
          totalIssuesFound: { increment: issues.length },
        },
      });

      issues.forEach((issue) => {
        const existing = this.ruleOccurrencesMap.get(issue.ruleId);
        const fallbackDesc =
          ENGLISH_RULE_DESCRIPTIONS[issue.ruleId] || 'Linguistic infraction detected';

        if (existing) {
          existing.count += 1;
        } else {
          this.ruleOccurrencesMap.set(issue.ruleId, {
            count: 1,
            description: fallbackDesc,
          });
        }
      });
    } catch {
      // Non-blocking background error suppression
    }
  }
}
