import React, { useRef, useCallback } from 'react';
import { TextIssue } from '@/shared/types/domain';
import styles from './EditorCanvas.module.css';

export interface EditorCanvasProps {
  readonly text: string;
  readonly onChange: (newText: string) => void;
  readonly issues: readonly TextIssue[];
  readonly onSelectIssue: (issue: TextIssue, targetEl: HTMLElement) => void;
  readonly placeholder?: string;
  readonly textareaRef?: React.RefObject<HTMLTextAreaElement>;
}

export const EditorCanvas: React.FC<EditorCanvasProps> = ({
  text,
  onChange,
  issues,
  onSelectIssue,
  placeholder = 'Type or paste your text here to analyze spelling, grammar, punctuation, and typography...',
  textareaRef: externalTextareaRef,
}) => {
  const backdropRef = useRef<HTMLDivElement>(null);
  const internalTextareaRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef = externalTextareaRef || internalTextareaRef;

  const handleScroll = useCallback(() => {
    if (backdropRef.current && textareaRef.current) {
      backdropRef.current.scrollTop = textareaRef.current.scrollTop;
      backdropRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

  const handleTextareaClick = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const clickOffset = textarea.selectionStart;

    if (clickOffset !== undefined && clickOffset !== null && issues.length > 0) {
      const matchedIssue = issues.find(
        (issue) => clickOffset >= issue.offset && clickOffset <= issue.offset + issue.length,
      );

      if (matchedIssue) {
        const markEl = backdropRef.current?.querySelector<HTMLElement>(
          `[data-issue-id="${matchedIssue.id}"]`,
        );
        onSelectIssue(matchedIssue, markEl || textarea);
      }
    }
  };

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
            data-issue-id={issue.id}
            className={`${styles.highlightSpan} ${categoryClass}`}
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
        onClick={handleTextareaClick}
        placeholder={placeholder}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
      />
    </div>
  );
};
