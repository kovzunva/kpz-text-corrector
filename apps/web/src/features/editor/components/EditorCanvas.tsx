import React, { useRef, useCallback } from 'react';
import { TextIssue } from '@/shared/types/domain';
import styles from './EditorCanvas.module.css';

export interface EditorCanvasProps {
  readonly text: string;
  readonly onChange: (newText: string) => void;
  readonly issues: readonly TextIssue[];
  readonly onSelectIssue: (issue: TextIssue, targetEl: HTMLElement) => void;
  readonly placeholder?: string;
}

export const EditorCanvas: React.FC<EditorCanvasProps> = ({
  text,
  onChange,
  issues,
  onSelectIssue,
  placeholder = 'Type or paste text to analyze...',
}) => {
  const backdropRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleScroll = useCallback(() => {
    if (backdropRef.current && textareaRef.current) {
      backdropRef.current.scrollTop = textareaRef.current.scrollTop;
      backdropRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

  const getHighlightCategoryClass = (category: string): string => {
    switch (category) {
      case 'spelling':
        return styles.highlightSpelling;
      case 'grammar':
        return styles.highlightGrammar;
      case 'style':
        return styles.highlightStyle;
      case 'typography':
        return styles.highlightTypography;
      default:
        return '';
    }
  };

  const renderBackdropElements = (): React.ReactNode => {
    if (!text) {
      return null;
    }

    const sortedIssues = [...issues].sort((a, b) => a.offset - b.offset);
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;

    sortedIssues.forEach((issue) => {
      if (issue.offset >= lastIndex && issue.offset + issue.length <= text.length) {
        if (issue.offset > lastIndex) {
          elements.push(
            <span key={`text-${lastIndex}`}>{text.substring(lastIndex, issue.offset)}</span>,
          );
        }

        const issueText = text.substring(issue.offset, issue.offset + issue.length);
        const categoryClass = getHighlightCategoryClass(issue.category);

        elements.push(
          <mark
            key={issue.id}
            className={`${styles.highlightSpan} ${categoryClass}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectIssue(issue, e.currentTarget);
            }}
          >
            {issueText}
          </mark>,
        );

        lastIndex = issue.offset + issue.length;
      }
    });

    if (lastIndex < text.length) {
      elements.push(<span key={`text-end`}>{text.substring(lastIndex)}</span>);
    }

    return elements;
  };

  return (
    <div className={styles.editorCanvasWrapper}>
      <div ref={backdropRef} className={styles.backdropLayer}>
        {renderBackdropElements()}
      </div>

      <textarea
        ref={textareaRef}
        className={styles.textareaLayer}
        value={text}
        onChange={(e) => onChange(e.target.value)}
        onScroll={handleScroll}
        placeholder={placeholder}
      />
    </div>
  );
};
