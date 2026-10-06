'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppButton, AppCard, AppTable, AppChip, AppColumn } from '@/shared/ui';
import { fetchGlobalStats } from '@/shared/api/stats.api';
import { GlobalStatistics } from '@/shared/types/domain';
import { useAuth } from '@/features/auth/context/AuthContext';
import styles from './page.module.css';

interface TopIssueRow {
  readonly rank: number;
  readonly ruleId: string;
  readonly friendlyName: string;
  readonly occurrences: number;
  readonly description: string;
}

const FRIENDLY_RULE_MAP: Record<string, { name: string; description: string }> = {
  UK_SIMPLE_REPLACE: {
    name: 'Language Spelling',
    description: 'Non-standard or archaic word spelling detected',
  },
  MULTIPLE_SPACES: {
    name: 'Multiple Spaces',
    description: 'Multiple consecutive spaces used instead of a single space',
  },
  TYPOGRAPHY_DOUBLE_SPACE: {
    name: 'Multiple Spaces',
    description: 'Multiple consecutive spaces used instead of a single space',
  },
  DOUBLE_SPACE: {
    name: 'Multiple Spaces',
    description: 'Multiple consecutive spaces used instead of a single space',
  },
  SPELLING_RULE: {
    name: 'Spelling Errors',
    description: 'Spelling mistake or typo detected in word',
  },
  TYPOGRAPHY_EM_DASH: {
    name: 'Em Dash Formatting',
    description: 'Hyphen (-) used instead of proper em dash (—)',
  },
  TYPOGRAPHY_QUOTES: {
    name: 'Quote Formatting',
    description: 'Straight quotes (" ") used instead of guillemets (« »)',
  },
  UKRAINIAN_SPELLING: {
    name: 'Language Spelling',
    description: 'Non-standard or archaic word spelling detected',
  },
  PUNCTUATION_COMMA: {
    name: 'Conjunction Punctuation',
    description: 'Missing comma before conjunction or clause',
  },
  STYLE_PASSIVE_VOICE: {
    name: 'Passive Voice Structure',
    description: 'Passive verb construction; consider active phrasing',
  },
  REDUNDANT_WORD: {
    name: 'Tautology & Pleonasm',
    description: 'Redundant or duplicate word in sentence',
  },
  CASE_AGREEMENT: {
    name: 'Case Agreement',
    description: 'Grammatical case or gender form mismatch',
  },
  SPACE_PUNCTUATION: {
    name: 'Punctuation Spacing',
    description: 'Extra space inserted before punctuation mark',
  },
  CAPITALIZATION: {
    name: 'Sentence Capitalization',
    description: 'Incorrect lowercase letter at start of sentence',
  },
};

export default function LandingPage(): React.JSX.Element {
  const [stats, setStats] = useState<GlobalStatistics | null>(null);
  const { isAuthenticated, openAuthModal } = useAuth();
  const isGuest = !isAuthenticated;

  useEffect(() => {
    fetchGlobalStats().then(setStats).catch(console.error);
  }, []);

  const columns: readonly AppColumn<TopIssueRow>[] = [
    {
      key: 'rank',
      header: '#',
      render: (row) => <strong>#{row.rank}</strong>,
    },
    {
      key: 'friendlyName',
      header: 'Infraction Category',
      render: (row) => <AppChip label={row.friendlyName} color="primary" />,
    },
    {
      key: 'description',
      header: 'Infraction Description',
      render: (row) => row.description,
    },
    {
      key: 'occurrences',
      header: 'Occurrences Count',
      render: (row) => <span>{row.occurrences.toLocaleString()}</span>,
    },
  ];

  const tableData: readonly TopIssueRow[] =
    stats?.topIssues.map((item, idx) => {
      const mapped = FRIENDLY_RULE_MAP[item.ruleId];

      const friendlyName = mapped
        ? mapped.name
        : item.ruleId
            .split('_')
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(' ');

      const rawDesc = mapped ? mapped.description : item.description;
      const hasCyrillic = /[а-яА-ЯєЄіІїЇґҐ]/.test(rawDesc);
      const cleanDesc = hasCyrillic ? 'Grammatical or typographic error detected' : rawDesc;

      return {
        rank: idx + 1,
        ruleId: item.ruleId,
        friendlyName,
        occurrences: item.occurrences,
        description: cleanDesc,
      };
    }) || [];

  return (
    <main className={styles.landingContainer}>
      {/* Screen 1: Hero */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Intelligent Text Correction & Dictionary Synchronization
          </h1>
          <p className={styles.heroSubtitle}>
            Automated detection of spelling, grammar, punctuation, and typography errors with custom rule filtering and virtual pagination.
          </p>
          <div className={styles.heroCtaGroup}>
            <Link href="/editor">
              <AppButton variantType="primary">
                Launch Workspace Editor
              </AppButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Screen 2: System Statistics */}
      <section className={styles.sectionScreen}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>System Statistics</h2>
          <p className={styles.sectionSubtitle}>
            Real-time activity and text processing engine performance metrics
          </p>
        </div>

        <div className={styles.statsGrid}>
          <AppCard elevated className={styles.statsCard}>
            <span className={styles.statsNumber}>
              {stats ? stats.totalUsers.toLocaleString() : '0'}
            </span>
            <span className={styles.statsLabel}>Registered Members</span>
            <span className={styles.statsDesc}>Active platform members utilizing dictionary sync</span>
          </AppCard>

          <AppCard elevated className={styles.statsCard}>
            <span className={styles.statsNumber}>
              {stats ? stats.totalCharactersChecked.toLocaleString() : '0'}
            </span>
            <span className={styles.statsLabel}>Characters Processed</span>
            <span className={styles.statsDesc}>Total text characters analyzed through engine runs</span>
          </AppCard>

          <AppCard elevated className={styles.statsCard}>
            <span className={styles.statsNumber}>
              {stats ? stats.totalIssuesFound.toLocaleString() : '0'}
            </span>
            <span className={styles.statsLabel}>Defects Detected</span>
            <span className={styles.statsDesc}>Syntax, spelling and typographic errors identified</span>
          </AppCard>
        </div>
      </section>

      {/* Screen 3: Top Infractions Table */}
      <section className={styles.sectionScreen}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Top 10 Linguistic Infractions</h2>
          <p className={styles.sectionSubtitle}>
            Aggregated common typography, spelling, and grammar mistakes recorded during text checks
          </p>
        </div>

        {/* Desktop Table View */}
        <div className={`${styles.tableWrapper} ${styles.desktopOnly}`}>
          <AppTable
            columns={columns}
            data={tableData}
            getRowId={(row) => row.ruleId}
          />
        </div>

        {/* Mobile Stacked Cards View */}
        <div className={`${styles.mobileCardsList} ${styles.mobileOnly}`}>
          {tableData.map((row) => (
            <AppCard key={row.ruleId} elevated className={styles.mobileInfractionCard}>
              <div className={styles.mobileCardHeader}>
                <span className={styles.mobileRank}>#{row.rank}</span>
                <AppChip label={row.friendlyName} color="primary" />
              </div>
              <p className={styles.mobileDescription}>{row.description}</p>
              <div className={styles.mobileCardFooter}>
                <span>Occurrences:</span>
                <strong className={styles.mobileCount}>{row.occurrences.toLocaleString()}</strong>
              </div>
            </AppCard>
          ))}
        </div>
      </section>

      {/* Screen 4: Guest Invitation Section */}
      {isGuest && (
        <section className={styles.sectionScreen}>
          <div className={styles.guestCardWrapper}>
            <AppCard elevated className={styles.guestCard}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Unlock Full Power as a Member</h2>
                <p className={styles.sectionSubtitle}>
                  Create a free account to extend your character limits and persist your personal dictionary
                </p>
              </div>

              <div className={styles.benefitsGrid}>
                <div className={styles.benefitItem}>
                  <h4 className={styles.benefitTitle}>Up to 50,000 Characters</h4>
                  <p className={styles.benefitText}>
                    Process extensive texts and full-length documents without guest quota restrictions.
                  </p>
                </div>

                <div className={styles.benefitItem}>
                  <h4 className={styles.benefitTitle}>Native .txt and .docx Import</h4>
                  <p className={styles.benefitText}>
                    Upload document buffers directly into the workspace editor for instant analysis.
                  </p>
                </div>

                <div className={styles.benefitItem}>
                  <h4 className={styles.benefitTitle}>Persistent Personal Dictionary</h4>
                  <p className={styles.benefitText}>
                    Save custom rule exclusion patterns permanently across all user sessions.
                  </p>
                </div>
              </div>

              <div className={styles.guestCta}>
                <AppButton variantType="primary" onClick={() => openAuthModal('register')}>
                  Register Free Account
                </AppButton>
              </div>
            </AppCard>
          </div>
        </section>
      )}
    </main>
  );
}


