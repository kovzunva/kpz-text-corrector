export type IssueCategory = 'spelling' | 'grammar' | 'style' | 'typography';

export interface IssueReplacement {
  readonly value: string;
}

export interface TextIssue {
  readonly id: string;
  readonly message: string;
  readonly offset: number;
  readonly length: number;
  readonly category: IssueCategory;
  readonly ruleId: string;
  readonly replacements: readonly IssueReplacement[];
}

export interface CheckTextResponse {
  readonly pageIndex: number;
  readonly totalPages: number;
  readonly issues: readonly TextIssue[];
  readonly metrics: {
    readonly characterCount: number;
    readonly wordCount: number;
  };
}

export interface UserDictionaryRule {
  readonly id: string;
  readonly userId: string;
  readonly wordPattern: string;
  readonly ruleId?: string;
  readonly createdAt: string;
}

export interface GlobalStatistics {
  readonly totalUsers: number;
  readonly totalCharactersChecked: number;
  readonly totalIssuesFound: number;
  readonly topIssues: readonly {
    readonly ruleId: string;
    readonly occurrences: number;
    readonly description: string;
  }[];
}
