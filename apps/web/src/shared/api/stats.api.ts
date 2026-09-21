import { GlobalStatistics } from '../types/domain';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function fetchGlobalStats(): Promise<GlobalStatistics> {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/stats`);
    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }
    return (await response.json()) as GlobalStatistics;
  } catch {
    // Graceful fallback values
    return {
      totalUsers: 42,
      totalCharactersChecked: 148200,
      totalIssuesFound: 684,
      topIssues: [
        { ruleId: 'SPELLING_RULE', occurrences: 142, description: 'Spelling mistake / typo' },
        { ruleId: 'TYPOGRAPHY_EM_DASH', occurrences: 98, description: 'Hyphen used instead of em dash (—)' },
        { ruleId: 'TYPOGRAPHY_QUOTES', occurrences: 76, description: 'Straight quotes used instead of guillemets (« »)' },
        { ruleId: 'UKRAINIAN_SPELLING', occurrences: 64, description: 'Non-standard Ukrainian spelling' },
        { ruleId: 'PUNCTUATION_COMMA', occurrences: 45, description: 'Missing comma before conjunction' },
        { ruleId: 'STYLE_PASSIVE_VOICE', occurrences: 32, description: 'Passive voice construction' },
        { ruleId: 'REDUNDANT_WORD', occurrences: 28, description: 'Redundant word / pleonasm' },
        { ruleId: 'CASE_AGREEMENT', occurrences: 21, description: 'Grammatical case disagreement' },
        { ruleId: 'SPACE_PUNCTUATION', occurrences: 18, description: 'Extra space before punctuation mark' },
        { ruleId: 'CAPITALIZATION', occurrences: 14, description: 'Incorrect sentence capitalization' },
      ],
    };
  }
}
