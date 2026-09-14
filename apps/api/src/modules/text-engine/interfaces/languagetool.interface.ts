export interface LanguageToolMatch {
  readonly message: string;
  readonly shortMessage?: string;
  readonly offset: number;
  readonly length: number;
  readonly replacements: readonly { readonly value: string }[];
  readonly rule: {
    readonly id: string;
    readonly description: string;
    readonly issueType: string;
    readonly category: {
      readonly id: string;
      readonly name: string;
    };
  };
}

export interface LanguageToolResponse {
  readonly matches: readonly LanguageToolMatch[];
}
