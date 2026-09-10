import React from 'react';
import { AppButton, AppCard, AppTextField, AppTooltip } from '@/shared/ui';
import styles from './page.module.css';

export default function HomePage(): React.JSX.Element {
  return (
    <main className={styles.mainContainer}>
      <AppCard elevated className={styles.heroCard}>
        <h1 className={styles.heroTitle}>TextGuard Studio</h1>
        <p className={styles.heroSubtitle}>
          Interactive text correction, dictionary management, and live linguistic analytics.
        </p>

        <AppTextField
          labelText="Sample Payload"
          placeholder="Enter text to analyze..."
          defaultValue="TextGuard Studio design system loaded successfully."
        />

        <div className={styles.buttonGroup}>
          <AppTooltip title="Launch Editor Canvas" category="grammar">
            <AppButton variantType="primary">
              Launch Workspace
            </AppButton>
          </AppTooltip>

          <AppButton variantType="secondary">
            View Analytics
          </AppButton>
        </div>
      </AppCard>
    </main>
  );
}
