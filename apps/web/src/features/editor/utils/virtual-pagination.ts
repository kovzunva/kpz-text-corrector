export interface PageSlice {
  readonly pageIndex: number;
  readonly startOffset: number;
  readonly endOffset: number;
  readonly text: string;
}

export function computeVirtualPages(fullText: string, pageSize: number = 2500): readonly PageSlice[] {
  if (!fullText) {
    return [
      {
        pageIndex: 0,
        startOffset: 0,
        endOffset: 0,
        text: '',
      },
    ];
  }

  const pages: PageSlice[] = [];
  let startIdx = 0;
  let pageIdx = 0;

  while (startIdx < fullText.length) {
    let targetEnd = Math.min(startIdx + pageSize, fullText.length);

    if (targetEnd < fullText.length) {
      const lastSpace = fullText.lastIndexOf(' ', targetEnd);
      if (lastSpace > startIdx) {
        targetEnd = lastSpace;
      }
    }

    pages.push({
      pageIndex: pageIdx,
      startOffset: startIdx,
      endOffset: targetEnd,
      text: fullText.substring(startIdx, targetEnd),
    });

    pageIdx++;
    startIdx = targetEnd;
    if (fullText[startIdx] === ' ') {
      startIdx++;
    }
  }

  return pages;
}
