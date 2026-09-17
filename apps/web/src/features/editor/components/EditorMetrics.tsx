import React from 'react';
import { TextIssue } from '@/shared/types/domain';
import styles from './EditorMetrics.module.css';

export interface EditorMetricsProps {
  readonly charCount: number;
  readonly wordCount: number;
  readonly issues: readonly TextIssue[];
}

export const EditorMetrics: React.FC<EditorMetricsProps> = ({
  charCount,
  wordCount,
  issues,
}) => {
  const spellingCount = issues.filter((i) => i.category === 'spelling').length;
  const grammarCount = issues.filter((i) => i.category === 'grammar').length;
  const styleCount = issues.filter((i) => i.category === 'style').length;
  const typographyCount = issues.filter((i) => i.category === 'typography').length;

  const defectDensity = wordCount > 0 ? ((issues.length / wordCount) * 100).toFixed(1) : '0.0';

  return (
    <div className={styles.metricsGrid}>
      <div className={styles.metricCard}>
        <span className={styles.metricValue}>{charCount}</span>
        <span className={styles.metricLabel}>Characters</span>
      </div>

      <div className={styles.metricCard}>
        <span className={styles.metricValue}>{wordCount}</span>
        <span className={styles.metricLabel}>Words</span>
      </div>

      <div className={styles.metricCard}>
        <span className={styles.metricValue}>{issues.length}</span>
        <span className={styles.metricLabel}>Total Issues</span>
      </div>

      <div className={styles.metricCard}>
        <span className={styles.metricValue}>{defectDensity}%</span>
        <span className={styles.metricLabel}>Defect Density</span>
      </div>

      <div className={styles.metricCard}>
        <span className={`${styles.metricValue} ${styles.metricSpelling}`}>{spellingCount}</span>
        <span className={styles.metricLabel}>Spelling</span>
      </div>

      <div className={styles.metricCard}>
        <span className={`${styles.metricValue} ${styles.metricGrammar}`}>{grammarCount}</span>
        <span className={styles.metricLabel}>Grammar</span>
      </div>

      <div className={styles.metricCard}>
        <span className={`${styles.metricValue} ${styles.metricStyle}`}>{styleCount}</span>
        <span className={styles.metricLabel}>Style</span>
      </div>

      <div className={styles.metricCard}>
        <span className={`${styles.metricValue} ${styles.metricTypography}`}>{typographyCount}</span>
        <span className={styles.metricLabel}>Typography</span>
      </div>
    </div>
  );
};
