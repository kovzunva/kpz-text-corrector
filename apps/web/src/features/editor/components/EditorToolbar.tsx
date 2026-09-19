import React from 'react';
import { AppButton, AppPagination } from '@/shared/ui';
import { FileImportButton } from '@/features/file-import/components/FileImportButton';
import styles from './EditorToolbar.module.css';

export interface EditorToolbarProps {
  readonly activePage: number;
  readonly totalPages: number;
  readonly isGuest: boolean;
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
  onPageChange,
  onCopyPageText,
  onCopyFullText,
  onGuestFileAttempt,
  onTextExtracted,
  onError,
}) => {
  return (
    <div className={styles.toolbarWrapper}>
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

      <div className={styles.actionsGroup}>
        <FileImportButton
          isGuest={isGuest}
          onGuestAttempt={onGuestFileAttempt}
          onTextExtracted={onTextExtracted}
          onError={onError}
        />
        <AppButton variantType="secondary" onClick={onCopyPageText}>
          Copy Page
        </AppButton>
        <AppButton variantType="outlined" onClick={onCopyFullText}>
          Copy All
        </AppButton>
      </div>
    </div>
  );
};
