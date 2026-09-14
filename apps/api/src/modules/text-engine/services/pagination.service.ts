import { Injectable } from '@nestjs/common';
import { TextIssue } from '../../../common/types/domain';

export interface PageSliceResult {
  readonly pageIndex: number;
  readonly totalPages: number;
  readonly pageText: string;
  readonly pageIssues: readonly TextIssue[];
}

@Injectable()
export class PaginationService {
  paginate(
    fullText: string,
    allIssues: readonly TextIssue[],
    requestedPageIndex: number = 0,
    pageSize: number = 2500,
  ): PageSliceResult {
    if (fullText.length === 0) {
      return {
        pageIndex: 0,
        totalPages: 1,
        pageText: '',
        pageIssues: [],
      };
    }

    const pages: { start: number; end: number; text: string }[] = [];
    let startIdx = 0;

    while (startIdx < fullText.length) {
      let targetEnd = Math.min(startIdx + pageSize, fullText.length);

      if (targetEnd < fullText.length) {
        const lastSpace = fullText.lastIndexOf(' ', targetEnd);
        if (lastSpace > startIdx) {
          targetEnd = lastSpace;
        }
      }

      pages.push({
        start: startIdx,
        end: targetEnd,
        text: fullText.substring(startIdx, targetEnd),
      });

      startIdx = targetEnd;
      if (fullText[startIdx] === ' ') {
        startIdx++;
      }
    }

    const totalPages = pages.length;
    const safePageIndex = Math.min(Math.max(0, requestedPageIndex), totalPages - 1);
    const activePage = pages[safePageIndex];

    const pageIssues: TextIssue[] = allIssues
      .filter(
        (issue) =>
          issue.offset >= activePage.start &&
          issue.offset + issue.length <= activePage.end,
      )
      .map((issue) => ({
        ...issue,
        offset: issue.offset - activePage.start,
      }));

    return {
      pageIndex: safePageIndex,
      totalPages,
      pageText: activePage.text,
      pageIssues,
    };
  }
}
