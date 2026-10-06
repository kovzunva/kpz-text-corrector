'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { TextIssue } from '@/shared/types/domain';
import { checkGuestText, checkUserText } from '@/shared/api/text-engine.api';
import { AppAlert, AppLinearProgress } from '@/shared/ui';
import { EditorCanvas } from './EditorCanvas';
import { EditorToolbar } from './EditorToolbar';
import { EditorMetrics } from './EditorMetrics';
import { CorrectionPopover } from './CorrectionPopover';
import { GuestPromoBanner } from './GuestPromoBanner';
import { GuestUpgradeModal } from '@/features/file-import/components/GuestUpgradeModal';
import { fetchDictionaryRules } from '@/shared/api/dictionary.api';
import { applyIssueReplacement, adjustIssuesOnTextChange } from '../utils/offset-calculator';
import { computeVirtualPages } from '../utils/virtual-pagination';
import { useAuth } from '@/features/auth/context/AuthContext';
import styles from './EditorShell.module.css';

export interface EditorShellProps {
  readonly initialText?: string;
  readonly isGuest?: boolean;
}

export const EditorShell: React.FC<EditorShellProps> = ({
  initialText = '',
}) => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const isGuest = !isAuthenticated;
  const [fullText, setFullText] = useState<string>(initialText);
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [allIssues, setAllIssues] = useState<readonly TextIssue[]>([]);
  const [sessionIgnoredIds, setSessionIgnoredIds] = useState<Set<string>>(new Set());
  const [alwaysIgnoredRules, setAlwaysIgnoredRules] = useState<Set<string>>(new Set());
  const [alwaysIgnoredWords, setAlwaysIgnoredWords] = useState<Set<string>>(new Set());
  const [isChecking, setIsChecking] = useState<boolean>(false);

  const [selectedIssue, setSelectedIssue] = useState<TextIssue | null>(null);
  const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState<boolean>(false);
  const [quotaErrorMessage, setQuotaErrorMessage] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDictionaryRules()
        .then((rules) => {
          const ruleIds = new Set<string>();
          const wordPatterns = new Set<string>();
          rules.forEach((r) => {
            if (r.ruleId) ruleIds.add(r.ruleId);
            if (r.wordPattern) wordPatterns.add(r.wordPattern.toLowerCase());
          });
          setAlwaysIgnoredRules(ruleIds);
          setAlwaysIgnoredWords(wordPatterns);
        })
        .catch(console.error);
    } else {
      setAlwaysIgnoredRules(new Set());
      setAlwaysIgnoredWords(new Set());
    }
  }, [isAuthenticated]);

  const virtualPages = useMemo(() => computeVirtualPages(fullText, 2500), [fullText]);
  const activePage = virtualPages[activePageIndex] || virtualPages[0];

  const maxChars = isGuest ? 1200 : 50000;
  const isOverQuota = fullText.length > maxChars;
  const quotaPercentage = Math.min(100, Math.round((fullText.length / maxChars) * 100));

  let statusVariant: 'normal' | 'warning' | 'danger' = 'normal';
  if (fullText.length >= maxChars) {
    statusVariant = 'danger';
  } else if (fullText.length >= Math.floor(maxChars * 0.9)) {
    statusVariant = 'warning';
  }

  const runAnalysis = useCallback(
    async (textToCheck: string) => {
      const maxAllowed = isGuest ? 1200 : 50000;
      if (!textToCheck.trim() || textToCheck.length > maxAllowed) {
        setAllIssues([]);
        return;
      }

      setIsChecking(true);
      setQuotaErrorMessage(null);

      try {
        const checkFn = isGuest ? checkGuestText : checkUserText;
        const response = await checkFn({
          text: textToCheck,
          pageIndex: 0,
          pageSize: 50000,
        });

        setAllIssues(response.issues);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to analyze text';
        setQuotaErrorMessage(msg);
      } finally {
        setIsChecking(false);
      }
    },
    [isGuest],
  );

  useEffect(() => {
    // Reset issues if text is completely cleared
    if (!fullText.trim()) {
      setAllIssues([]);
    }
  }, [fullText]);

  const activePageIssues = useMemo(() => {
    return allIssues
      .filter((issue) => {
        if (sessionIgnoredIds.has(issue.id)) return false;
        if (issue.ruleId && alwaysIgnoredRules.has(issue.ruleId)) return false;

        const issueText = activePage.text
          .substring(issue.offset, issue.offset + issue.length)
          .toLowerCase();
        if (Array.from(alwaysIgnoredWords).some((w) => issueText.includes(w))) {
          return false;
        }

        return (
          issue.offset >= activePage.startOffset &&
          issue.offset + issue.length <= activePage.endOffset
        );
      })
      .map((issue) => ({
        ...issue,
        offset: issue.offset - activePage.startOffset,
      }));
  }, [allIssues, activePage, sessionIgnoredIds, alwaysIgnoredRules, alwaysIgnoredWords]);

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
    const localOffset = issue.offset - activePage.startOffset;
    const newCursorPos = Math.max(0, localOffset + replacement.length);
    const currentScrollTop = textareaRef.current?.scrollTop;
    const currentScrollLeft = textareaRef.current?.scrollLeft;

    const { updatedText, updatedIssues } = applyIssueReplacement(
      fullText,
      issue,
      replacement,
      allIssues,
    );

    setFullText(updatedText);
    setAllIssues(updatedIssues);

    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        if (currentScrollTop !== undefined) {
          textareaRef.current.scrollTop = currentScrollTop;
        }
        if (currentScrollLeft !== undefined) {
          textareaRef.current.scrollLeft = currentScrollLeft;
        }
      }
    });
  };

  const handleIgnoreOnce = (issueId: string) => {
    const currentScrollTop = textareaRef.current?.scrollTop;
    const currentSelection = textareaRef.current?.selectionStart;

    setSessionIgnoredIds((prev) => new Set(prev).add(issueId));

    requestAnimationFrame(() => {
      if (textareaRef.current && currentSelection !== null && currentSelection !== undefined) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(currentSelection, currentSelection);
        if (currentScrollTop !== undefined) {
          textareaRef.current.scrollTop = currentScrollTop;
        }
      }
    });
  };

  const handleAlwaysIgnore = (ruleId: string, wordPattern: string = '') => {
    const currentScrollTop = textareaRef.current?.scrollTop;
    const currentSelection = textareaRef.current?.selectionStart;

    if (ruleId) {
      setAlwaysIgnoredRules((prev) => new Set(prev).add(ruleId));
    }
    if (wordPattern) {
      setAlwaysIgnoredWords((prev) => new Set(prev).add(wordPattern.toLowerCase()));
    }

    requestAnimationFrame(() => {
      if (textareaRef.current && currentSelection !== null && currentSelection !== undefined) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(currentSelection, currentSelection);
        if (currentScrollTop !== undefined) {
          textareaRef.current.scrollTop = currentScrollTop;
        }
      }
    });
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
      {/* 1. Header row */}
      <div className={styles.headerTitleGroup}>
        <h1 className={styles.title}>Workspace Editor</h1>
        <div className={styles.statusIndicator}>
          {isChecking
            ? 'Checking text...'
            : allIssues.length > 0
            ? 'Analysis synchronized'
            : 'Ready to check'}
        </div>
      </div>

      {/* 2. Quota Capacity */}
      {isOverQuota && (
        <AppAlert severity="error">
          {isGuest
            ? `Guest quota limit reached (${fullText.length.toLocaleString()} / 1,200 characters). Please register to analyze up to 50,000 characters.`
            : `Member quota limit reached (${fullText.length.toLocaleString()} / 50,000 characters).`}
        </AppAlert>
      )}

      {quotaErrorMessage && !isOverQuota && (
        <AppAlert severity="warning">{quotaErrorMessage}</AppAlert>
      )}

      <div className={styles.quotaWrapper}>
        <div className={styles.quotaHeader}>
          <span>
            {isGuest ? 'Guest' : 'Member'} Quota Capacity ({fullText.length.toLocaleString()} / {maxChars.toLocaleString()} chars)
          </span>
          <span>{quotaPercentage}%</span>
        </div>
        <AppLinearProgress value={quotaPercentage} statusVariant={statusVariant} />
      </div>

      {/* 3. Main text field */}
      <EditorCanvas
        text={activePage.text}
        onChange={(newText) => {
          const prefix = fullText.substring(0, activePage.startOffset);
          const suffix = fullText.substring(activePage.endOffset);
          const newFullText = `${prefix}${newText}${suffix}`;

          if (allIssues.length > 0) {
            const adjustedIssues = adjustIssuesOnTextChange(fullText, newFullText, allIssues);
            setAllIssues(adjustedIssues);
          }

          setFullText(newFullText);
        }}
        issues={activePageIssues}
        onSelectIssue={handleSelectIssue}
        textareaRef={textareaRef}
      />

      {/* 4. Pagination & actions */}
      <EditorToolbar
        activePage={activePageIndex}
        totalPages={virtualPages.length}
        isGuest={isGuest}
        isChecking={isChecking}
        onRunCheck={() => void runAnalysis(fullText)}
        onPageChange={(page) => setActivePageIndex(page)}
        onCopyPageText={handleCopyPage}
        onCopyFullText={handleCopyAll}
        onGuestFileAttempt={() => setIsUpgradeModalOpen(true)}
        onTextExtracted={(newText) => {
          setFullText(newText);
          void runAnalysis(newText);
        }}
        onError={(msg) => setQuotaErrorMessage(msg)}
      />

      {/* 5. Statistics */}
      <EditorMetrics
        charCount={fullText.length}
        wordCount={fullText.trim() ? fullText.trim().split(/\s+/).length : 0}
        issues={allIssues.filter(
          (i) => !sessionIgnoredIds.has(i.id) && !alwaysIgnoredRules.has(i.ruleId),
        )}
        isGuest={isGuest}
      />

      {/* 6. Registration CTA banner */}
      {isGuest && <GuestPromoBanner onRegisterClick={() => setIsUpgradeModalOpen(true)} />}

      <CorrectionPopover
        anchorEl={popoverAnchor}
        issue={selectedIssue}
        isGuest={isGuest}
        onClose={handleClosePopover}
        onApplyReplacement={handleApplyReplacement}
        onIgnoreOnce={handleIgnoreOnce}
        onAlwaysIgnore={handleAlwaysIgnore}
        wordSubstr={selectedWordSubstr}
        onGuestAuthPrompt={() => setIsUpgradeModalOpen(true)}
      />

      <GuestUpgradeModal
        open={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        onRegisterClick={() => {
          setIsUpgradeModalOpen(false);
          openAuthModal('register');
        }}
      />
    </div>
  );
};
