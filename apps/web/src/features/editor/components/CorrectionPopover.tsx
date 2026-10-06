import React from 'react';
import { AppPopover, AppButton } from '@/shared/ui';
import { TextIssue } from '@/shared/types/domain';
import { createDictionaryRule } from '@/shared/api/dictionary.api';
import styles from './CorrectionPopover.module.css';

export interface CorrectionPopoverProps {
  readonly anchorEl: HTMLElement | null;
  readonly issue: TextIssue | null;
  readonly isGuest?: boolean;
  readonly onClose: () => void;
  readonly onApplyReplacement: (issue: TextIssue, replacement: string) => void;
  readonly onIgnoreOnce: (issueId: string) => void;
  readonly onAlwaysIgnore: (ruleId: string, wordPattern: string) => void;
  readonly wordSubstr?: string;
  readonly onGuestAuthPrompt?: () => void;
}

export const CorrectionPopover: React.FC<CorrectionPopoverProps> = ({
  anchorEl,
  issue,
  isGuest = false,
  onClose,
  onApplyReplacement,
  onIgnoreOnce,
  onAlwaysIgnore,
  wordSubstr = '',
  onGuestAuthPrompt,
}) => {
  if (!issue) {
    return null;
  }

  const getBadgeClass = (): string => {
    switch (issue.category) {
      case 'spelling':
        return styles.badgeSpelling;
      case 'grammar':
        return styles.badgeGrammar;
      case 'style':
        return styles.badgeStyle;
      case 'typography':
        return styles.badgeTypography;
      default:
        return '';
    }
  };

  return (
    <AppPopover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <div className={styles.popoverContainer}>
        <div className={styles.header}>
          <span className={`${styles.categoryBadge} ${getBadgeClass()}`}>
            {issue.category}
          </span>
          <p className={styles.message}>{issue.message}</p>
        </div>


        {issue.replacements.length > 0 && (
          <>
            <span className={styles.sectionTitle}>Suggestions</span>
            <div className={styles.replacementsList}>
              {issue.replacements.map((rep, idx) => (
                <AppButton
                  key={`${rep.value}-${idx}`}
                  variantType="primary"
                  onClick={() => {
                    onApplyReplacement(issue, rep.value);
                    onClose();
                  }}
                >
                  {rep.value}
                </AppButton>
              ))}
            </div>
          </>
        )}

        <div className={styles.actionsDivider} />

        <div className={styles.actionsGroup}>
          <AppButton
            variantType="secondary"
            onClick={() => {
              onIgnoreOnce(issue.id);
              onClose();
            }}
          >
            Ignore Once
          </AppButton>

          <AppButton
            variantType="outlined"
            onClick={() => {
              if (isGuest) {
                if (onGuestAuthPrompt) {
                  onGuestAuthPrompt();
                }
                onClose();
                return;
              }
              void createDictionaryRule(wordSubstr, issue.ruleId).catch(() => {});
              onAlwaysIgnore(issue.ruleId, wordSubstr);
              onClose();
            }}
            title={isGuest ? 'Sign in to save persistent dictionary rules' : 'Always ignore rule'}
          >
            Always Ignore
          </AppButton>
        </div>
      </div>
    </AppPopover>
  );
};
