import { Injectable } from '@nestjs/common';
import { TextIssue } from '../../../common/types/domain';

@Injectable()
export class HeuristicsService {
  analyzeTypography(text: string): readonly TextIssue[] {
    const issues: TextIssue[] = [];

    // Rule 1: Double hyphens or spaced hyphen used as em-dash
    const dashRegex = /(?:\s-\s|--)/g;
    let match: RegExpExecArray | null;

    while ((match = dashRegex.exec(text)) !== null) {
      issues.push({
        id: `heur-dash-${match.index}`,
        message: 'Use an em dash (—) instead of a hyphen between words.',
        offset: match.index,
        length: match[0].length,
        category: 'typography',
        ruleId: 'TYPOGRAPHY_EM_DASH',
        replacements: [{ value: ' — ' }],
      });
    }

    // Rule 2: Straight double quotes in Ukrainian text
    const quoteRegex = /"([^"]+)"/g;
    while ((match = quoteRegex.exec(text)) !== null) {
      issues.push({
        id: `heur-quote-${match.index}`,
        message: 'Use typographic guillemets (« ») for quotation in Ukrainian.',
        offset: match.index,
        length: match[0].length,
        category: 'typography',
        ruleId: 'TYPOGRAPHY_QUOTES',
        replacements: [{ value: `«${match[1]}»` }],
      });
    }

    return issues;
  }
}
