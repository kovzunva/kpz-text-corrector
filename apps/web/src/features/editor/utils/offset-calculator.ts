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

export function adjustIssuesOnTextChange(
  oldText: string,
  newText: string,
  issues: readonly TextIssue[],
): TextIssue[] {
  if (oldText === newText) return [...issues];
  if (!issues.length) return [];

  let commonPrefix = 0;
  const minLength = Math.min(oldText.length, newText.length);
  while (commonPrefix < minLength && oldText[commonPrefix] === newText[commonPrefix]) {
    commonPrefix++;
  }

  let commonSuffix = 0;
  const maxSuffix = Math.min(oldText.length - commonPrefix, newText.length - commonPrefix);
  while (
    commonSuffix < maxSuffix &&
    oldText[oldText.length - 1 - commonSuffix] === newText[newText.length - 1 - commonSuffix]
  ) {
    commonSuffix++;
  }

  const editStart = commonPrefix;
  const editOldEnd = oldText.length - commonSuffix;
  const delta = newText.length - oldText.length;

  return issues
    .filter((issue) => {
      const issueStart = issue.offset;
      const issueEnd = issue.offset + issue.length;

      if (editOldEnd > editStart) {
        if (issueStart < editOldEnd && issueEnd > editStart) {
          return false;
        }
      } else {
        if (issueStart < editStart && issueEnd > editStart) {
          return false;
        }
      }
      return true;
    })
    .map((issue) => {
      const issueStart = issue.offset;
      if (issueStart >= editOldEnd) {
        return {
          ...issue,
          offset: issueStart + delta,
        };
      }
      return issue;
    });
}

