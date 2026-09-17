import { TextIssue } from '@/shared/types/domain';

export interface ApplyReplacementResult {
  readonly updatedText: string;
  readonly updatedIssues: readonly TextIssue[];
}

export function applyIssueReplacement(
  currentText: string,
  targetIssue: TextIssue,
  replacementText: string,
  allIssues: readonly TextIssue[],
): ApplyReplacementResult {
  const start = targetIssue.offset;
  const end = targetIssue.offset + targetIssue.length;

  const prefix = currentText.substring(0, start);
  const suffix = currentText.substring(end);
  const updatedText = `${prefix}${replacementText}${suffix}`;

  const delta = replacementText.length - targetIssue.length;

  const updatedIssues = allIssues
    .filter((issue) => issue.id !== targetIssue.id)
    .map((issue) => {
      if (issue.offset > start) {
        return {
          ...issue,
          offset: issue.offset + delta,
        };
      }
      return issue;
    });

  return {
    updatedText,
    updatedIssues,
  };
}
