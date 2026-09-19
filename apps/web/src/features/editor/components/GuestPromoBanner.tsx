import React from 'react';
import { AppButton } from '@/shared/ui';
import styles from './GuestPromoBanner.module.css';

export interface GuestPromoBannerProps {
  readonly onRegisterClick: () => void;
}

export const GuestPromoBanner: React.FC<GuestPromoBannerProps> = ({ onRegisterClick }) => {
  return (
    <div className={styles.bannerWrapper}>
      <div className={styles.textGroup}>
        <h4 className={styles.bannerTitle}>Unlock 50,000 Character Allowance & Custom Dictionary</h4>
        <p className={styles.bannerDesc}>
          Create a free account to upload `.docx` files, save custom rule exclusions, and process full-length documents without guest limitations.
        </p>
      </div>

      <AppButton variantType="primary" onClick={onRegisterClick}>
        Register Account
      </AppButton>
    </div>
  );
};
