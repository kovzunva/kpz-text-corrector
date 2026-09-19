import React from 'react';
import { AppModal, AppButton } from '@/shared/ui';
import styles from './GuestUpgradeModal.module.css';

export interface GuestUpgradeModalProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onRegisterClick: () => void;
}

export const GuestUpgradeModal: React.FC<GuestUpgradeModalProps> = ({
  open,
  onClose,
  onRegisterClick,
}) => {
  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="Unlock Member Features"
      actions={
        <>
          <AppButton variantType="secondary" onClick={onClose}>
            Continue as Guest
          </AppButton>
          <AppButton variantType="primary" onClick={onRegisterClick}>
            Register Free Account
          </AppButton>
        </>
      }
    >
      <div className={styles.modalContent}>
        <p>
          Document file uploads (`.txt`, `.docx`) and extended character limits are exclusive to registered members.
        </p>

        <ul className={styles.featureList}>
          <li className={styles.featureItem}>
            <span className={styles.featureCheck}>✓</span> Up to 50,000 characters per document
          </li>
          <li className={styles.featureItem}>
            <span className={styles.featureCheck}>✓</span> Native `.txt` and `.docx` file buffer extraction
          </li>
          <li className={styles.featureItem}>
            <span className={styles.featureCheck}>✓</span> Personalized dictionary rule synchronization
          </li>
        </ul>
      </div>
    </AppModal>
  );
};
