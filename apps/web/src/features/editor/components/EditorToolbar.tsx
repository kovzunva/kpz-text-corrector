import React from 'react';
import { AppButton, AppPagination } from '@/shared/ui';
import { FileImportButton } from '@/features/file-import/components/FileImportButton';
import styles from './EditorToolbar.module.css';

export interface EditorToolbarProps {
  readonly activePage: number;
  readonly totalPages: number;
  readonly isGuest: boolean;
  readonly isChecking: boolean;
  readonly hasText: boolean;
  readonly onRunCheck: () => void;
  readonly onClearText: () => void;
  readonly onPageChange: (newPage: number) => void;
  readonly onCopyPageText: () => void;
  readonly onCopyFullText: () => void;
  readonly onGuestFileAttempt: () => void;
  readonly onTextExtracted: (text: string) => void;
  readonly onError?: (msg: string) => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  activePage,
  totalPages,
  isGuest,
  isChecking,
  hasText,
  onRunCheck,
  onClearText,
  onPageChange,
  onCopyPageText,
  onCopyFullText,
  onGuestFileAttempt,
  onTextExtracted,
  onError,
}) => {
  return (
    <div className={styles.toolbarWrapper}>
      <div className={styles.pageGroup}>
        <span className={styles.pageInfo}>
          Page {activePage + 1} of {totalPages}
        </span>

        {totalPages > 1 && (
          <AppPagination
            count={totalPages}
            page={activePage + 1}
            onChange={(_, page) => onPageChange(page - 1)}
          />
        )}
      </div>

      <div className={styles.actionsGroup}>
        {hasText && (
          <AppButton variantType="outlined" onClick={onClearText}>
            Clear
          </AppButton>
        )}

        {!isGuest && (
          <FileImportButton
            isGuest={isGuest}
            onGuestAttempt={onGuestFileAttempt}
            onTextExtracted={onTextExtracted}
            onError={onError}
          />
        )}

        {totalPages > 1 ? (
          <>
            <AppButton variantType="secondary" onClick={onCopyPageText}>
              Copy Page
            </AppButton>
            <AppButton variantType="secondary" onClick={onCopyFullText}>
              Copy All
            </AppButton>
          </>
        ) : (
          <AppButton variantType="secondary" onClick={onCopyFullText}>
            Copy
          </AppButton>
        )}
        
        <AppButton variantType="primary" onClick={onRunCheck} disabled={isChecking}>
          {isChecking ? 'Analyzing...' : 'Check Text'}
        </AppButton>
      </div>
    </div>
  );
};
