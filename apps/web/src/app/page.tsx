'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppButton, AppCard, AppTable, AppChip, AppColumn } from '@/shared/ui';
import { fetchGlobalStats } from '@/shared/api/stats.api';
import { GlobalStatistics } from '@/shared/types/domain';
import styles from './page.module.css';

interface TopIssueRow {
  readonly rank: number;
  readonly ruleId: string;
  readonly occurrences: number;
  readonly description: string;
}

export default function LandingPage(): React.JSX.Element {
  const [stats, setStats] = useState<GlobalStatistics | null>(null);

  useEffect(() => {
    fetchGlobalStats().then(setStats).catch(console.error);
  }, []);

  const columns: readonly AppColumn<TopIssueRow>[] = [
    {
      key: 'rank',
      header: '# Rank',
      render: (row) => <strong>#{row.rank}</strong>,
    },
    {
      key: 'ruleId',
      header: 'Rule Identifier',
      render: (row) => <AppChip label={row.ruleId} color="primary" />,
    },
    {
      key: 'description',
      header: 'Infraction Description',
      render: (row) => row.description,
    },
    {
      key: 'occurrences',
      header: 'Occurrences Recorded',
      render: (row) => <span>{row.occurrences.toLocaleString()}</span>,
    },
  ];

  const tableData: readonly TopIssueRow[] = stats?.topIssues.map((item, idx) => ({
    rank: idx + 1,
    ruleId: item.ruleId,
    occurrences: item.occurrences,
    description: item.description,
  })) || [];

  return (
    <main className={styles.landingContainer}>
      <section className={styles.heroSection}>
        <span className={styles.heroBadge}>✨ Real-Time Text Engine v2.0</span>
        <h1 className={styles.heroTitle}>
          Intelligent Text Correction <br />
          <span className={styles.heroTitleGradient}>& Dictionary Sync</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Eliminate spelling typos, grammar mistakes, and typographic errors with custom rule suppression, virtual page slicing, and live analytics.
        </p>
        <div className={styles.heroCtaGroup}>
          <Link href="/editor">
            <AppButton variantType="primary">Launch Workspace Editor</AppButton>
          </Link>
          <Link href="/dictionary">
            <AppButton variantType="secondary">Manage Dictionary</AppButton>
          </Link>
        </div>
      </section>

      <section className={styles.statsGrid}>
        <AppCard elevated className={styles.statsCard}>
          <span className={styles.statsNumber}>
            {stats ? stats.totalUsers.toLocaleString() : '42'}
          </span>
          <span className={styles.statsLabel}>Registered Members</span>
        </AppCard>

        <AppCard elevated className={styles.statsCard}>
          <span className={styles.statsNumber}>
            {stats ? stats.totalCharactersChecked.toLocaleString() : '148,200'}
          </span>
          <span className={styles.statsLabel}>Characters Processed</span>
        </AppCard>

        <AppCard elevated className={styles.statsCard}>
          <span className={styles.statsNumber}>
            {stats ? stats.totalIssuesFound.toLocaleString() : '684'}
          </span>
          <span className={styles.statsLabel}>Defects Detected</span>
        </AppCard>
      </section>

      <section className={styles.sectionTitleGroup}>
        <h2 className={styles.sectionTitle}>Top 10 Linguistic Infractions</h2>
        <p className={styles.sectionSubtitle}>
          Aggregated common syntax, spelling, and typography mistakes recorded across text check runs.
        </p>
      </section>

      <div className={styles.tableWrapper}>
        <AppTable
          columns={columns}
          data={tableData}
          getRowId={(row) => row.ruleId}
        />
      </div>
    </main>
  );
}
