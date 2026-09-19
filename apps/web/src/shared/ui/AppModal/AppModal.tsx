import React from 'react';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import styles from './AppModal.module.css';

export interface AppModalProps extends Omit<DialogProps, 'style' | 'sx'> {
  readonly title?: string;
  readonly actions?: React.ReactNode;
  readonly customClassName?: string;
}

export const AppModal: React.FC<AppModalProps> = ({
  open,
  onClose,
  title,
  children,
  actions,
  customClassName = '',
  className = '',
  ...restProps
}) => {
  const paperClass = [styles.appModalPaper, customClassName, className]
    .filter(Boolean)
    .join(' ');

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        className: paperClass,
      }}
      {...restProps}
    >
      {title && <h3 className={styles.appModalTitle}>{title}</h3>}
      <div className={styles.appModalContent}>{children}</div>
      {actions && <div className={styles.appModalActions}>{actions}</div>}
    </Dialog>
  );
};
