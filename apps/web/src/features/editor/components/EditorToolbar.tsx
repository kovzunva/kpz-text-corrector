import React from 'react';
import { AppButton, AppPagination } from '@/shared/ui';
import styles from './EditorToolbar.module.css';

export interface EditorToolbarProps {
  readonly activePage: number;
  readonly totalPages: number;
  readonly onPageChange: (newPage: number) => void;
  readonly onCopyPageText: () => void;
  readonly onCopyFullText: () => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  activePage,
  totalPages,
  onPageChange,
  onCopyPageText,
  onCopyFullText,
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
