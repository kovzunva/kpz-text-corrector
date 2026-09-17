'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { TextIssue } from '@/shared/types/domain';
import { checkGuestText } from '@/shared/api/text-engine.api';
import { EditorCanvas } from './EditorCanvas';
import { EditorToolbar } from './EditorToolbar';
import { EditorMetrics } from './EditorMetrics';
import { CorrectionPopover } from './CorrectionPopover';
import { applyIssueReplacement } from '../utils/offset-calculator';
import { computeVirtualPages } from '../utils/virtual-pagination';
import styles from './EditorShell.module.css';

export interface EditorShellProps {
  readonly initialText?: string;
  readonly isGuest?: boolean;
}

export const EditorShell: React.FC<EditorShellProps> = ({
  initialText = 'Вітаємо у TextGuard Studio -- сервісі для перевірки тексту. Текст можна редагувати "онлайн".',
  isGuest = true,
}) => {
  const [fullText, setFullText] = useState<string>(initialText);
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [allIssues, setAllIssues] = useState<readonly TextIssue[]>([]);
  const [sessionIgnoredIds, setSessionIgnoredIds] = useState<Set<string>>(new Set());
  const [alwaysIgnoredRules, setAlwaysIgnoredRules] = useState<Set<string>>(new Set());
  const [isChecking, setIsChecking] = useState<boolean>(false);

  const [selectedIssue, setSelectedIssue] = useState<TextIssue | null>(null);
  const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null);

  const virtualPages = useMemo(() => computeVirtualPages(fullText, 2500), [fullText]);
  const activePage = virtualPages[activePageIndex] || virtualPages[0];

  const runAnalysis = useCallback(
    async (textToCheck: string) => {
      if (!textToCheck.trim()) {
        setAllIssues([]);
        return;
      }

      setIsChecking(true);
      try {
        const response = await checkGuestText({
          text: textToCheck,
          pageIndex: 0,
          pageSize: 50000,
        });

        setAllIssues(response.issues);
      } catch (err) {
        console.error('Failed to run backend text check:', err);
      } finally {
        setIsChecking(false);
      }
    },
    [],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      runAnalysis(fullText);
    }, 600);

    return () => clearTimeout(timer);
  }, [fullText, runAnalysis]);

  const activePageIssues = useMemo(() => {
    return allIssues
      .filter((issue) => {
        if (sessionIgnoredIds.has(issue.id)) return false;
        if (alwaysIgnoredRules.has(issue.ruleId)) return false;

        return (
          issue.offset >= activePage.startOffset &&
          issue.offset + issue.length <= activePage.endOffset
        );
      })
      .map((issue) => ({
        ...issue,
        offset: issue.offset - activePage.startOffset,
      }));
  }, [allIssues, activePage, sessionIgnoredIds, alwaysIgnoredRules]);

  const handleSelectIssue = (issue: TextIssue, targetEl: HTMLElement) => {
    const globalIssue = allIssues.find(
      (i) => i.id === issue.id || (i.offset === issue.offset + activePage.startOffset && i.ruleId === issue.ruleId),
    );
    setSelectedIssue(globalIssue || issue);
    setPopoverAnchor(targetEl);
  };

  const handleClosePopover = () => {
    setSelectedIssue(null);
    setPopoverAnchor(null);
  };

  const handleApplyReplacement = (issue: TextIssue, replacement: string) => {
    const { updatedText, updatedIssues } = applyIssueReplacement(
      fullText,
      issue,
      replacement,
      allIssues,
    );

    setFullText(updatedText);
    setAllIssues(updatedIssues);
  };

  const handleIgnoreOnce = (issueId: string) => {
    setSessionIgnoredIds((prev) => new Set(prev).add(issueId));
  };

  const handleAlwaysIgnore = (ruleId: string) => {
    setAlwaysIgnoredRules((prev) => new Set(prev).add(ruleId));
  };

  const handleCopyPage = async () => {
    await navigator.clipboard.writeText(activePage.text);
  };

  const handleCopyAll = async () => {
    await navigator.clipboard.writeText(fullText);
  };

  const selectedWordSubstr = useMemo(() => {
    if (!selectedIssue) return '';
    return fullText.substring(selectedIssue.offset, selectedIssue.offset + selectedIssue.length);
  }, [selectedIssue, fullText]);

  return (
    <div className={styles.shellContainer}>
      <div className={styles.headerTitleGroup}>
        <h1 className={styles.title}>Workspace Editor</h1>
        <div className={styles.statusIndicator}>
          {isChecking ? 'Checking text...' : 'Analysis synchronized'}
        </div>
      </div>

      {isGuest && (
        <div className={styles.guestBanner}>
          <span>Guest Mode: Max 1,200 characters allowed. Sign in for 50,000 capacity.</span>
        </div>
      )}

      <EditorMetrics
        charCount={fullText.length}
        wordCount={fullText.trim() ? fullText.trim().split(/\s+/).length : 0}
        issues={allIssues.filter(
          (i) => !sessionIgnoredIds.has(i.id) && !alwaysIgnoredRules.has(i.ruleId),
        )}
      />

      <EditorToolbar
        activePage={activePageIndex}
        totalPages={virtualPages.length}
        onPageChange={(page) => setActivePageIndex(page)}
        onCopyPageText={handleCopyPage}
        onCopyFullText={handleCopyAll}
      />

      <EditorCanvas
        text={activePage.text}
        onChange={(newText) => {
          const prefix = fullText.substring(0, activePage.startOffset);
          const suffix = fullText.substring(activePage.endOffset);
          setFullText(`${prefix}${newText}${suffix}`);
        }}
        issues={activePageIssues}
        onSelectIssue={handleSelectIssue}
      />

      <CorrectionPopover
        anchorEl={popoverAnchor}
        issue={selectedIssue}
        onClose={handleClosePopover}
        onApplyReplacement={handleApplyReplacement}
        onIgnoreOnce={handleIgnoreOnce}
        onAlwaysIgnore={handleAlwaysIgnore}
        wordSubstr={selectedWordSubstr}
      />
    </div>
  );
};
