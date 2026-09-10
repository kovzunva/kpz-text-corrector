# Application Logic & Engine Specification

## 1. Multi-Pass Backend Text Pipeline

Every text check request undergoes sequential processing:

[Client / Next.js Canvas]
│
▼ (1) Text Payload + Auth State
[NestJS Pipeline Gateway]
│
├─► (2) Third-Party Grammar Engine (LanguageTool)
│         │
│         ▼ Raw Issue Tokens (offset, length, rule)
├─► (3) User Dictionary Filter (Suppress Ignored Rules)
│         │
│         ▼
├─► (4) Custom Heuristics Layer (Typography & Punctuation)
│         │
│         ▼
└─► (5) Pagination & Relative Offset Slicer
│
▼ Clean Segmented Issues
[Client Highlight Backdrop]

1. **Quota & Input Validation**: Validates payload length against role policies (1,200 chars for guests, 50,000 for users).
2. **External Engine Execution**: Dispatches payload to LanguageTool API and extracts raw issue tokens containing global character offsets and lengths.
3. **Dictionary Rule Suppression**: Queries PostgreSQL for the user's active ignore list and discards matching rule IDs or identical word substrings.
4. **Heuristics Processing**: Runs local regex checks for language typography (proper quotation marks, correct dash symbols, non-breaking spacing).
5. **Pagination & Offset Mapping**: Slices document text into pages without breaking words and recalibrates global issue offsets into page-relative indices.
6. **Analytics Event Emission**: Asynchronously updates counter tallies in the database without blocking the response cycle.

---

## 2. Dynamic Offset Recalculation Model

Applying a suggestion requires real-time adjustment of all subsequent highlights on the current page:
1. Target issue defined by range `[offsetStart, offsetEnd]` is replaced by string `replacementText`.
2. Delta calculation:
   $$\Delta = \text{length}(\text{replacementText}) - (\text{offsetEnd} - \text{offsetStart})$$
3. Every subsequent issue satisfying `issue.offsetStart > current.offsetEnd` is shifted:
   $$\text{issue.offsetStart} \leftarrow \text{issue.offsetStart} + \Delta$$
   $$\text{issue.offsetEnd} \leftarrow \text{issue.offsetEnd} + \Delta$$
4. Complete text state updates and triggers a debounced backend synchronization.

---

## 3. Data Contracts

```typescript
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
```

## 4. Rate Limiting & Safety

    IP Throttling: Guest endpoints are constrained to a maximum of 10 requests per minute via NestJS Throttler.

    File Ingestion: File buffers are inspected via magic bytes to prevent spoofed uploads, with a strict 5MB file size limit.

    Canvas Sanitization: Text slices passed to the background HTML highlight layer are HTML-escaped before insertion to prevent DOM XSS vulnerabilities.