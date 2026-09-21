'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  AppButton,
  AppCard,
  AppTextField,
  AppTable,
  AppChip,
  AppColumn,
} from '@/shared/ui';
import { fetchDictionaryRules, deleteDictionaryRule } from '@/shared/api/dictionary.api';
import { UserDictionaryRule } from '@/shared/types/domain';
import styles from './DictionaryManager.module.css';

export const DictionaryManager: React.FC = () => {
  const [rules, setRules] = useState<readonly UserDictionaryRule[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    fetchDictionaryRules().then(setRules).catch(console.error);
  }, []);

  const handleDelete = async (id: string) => {
    const ok = await deleteDictionaryRule(id);
    if (ok) {
      setRules((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const filteredRules = rules.filter((rule) => {
    const q = searchQuery.toLowerCase();
    const patternMatch = rule.wordPattern.toLowerCase().includes(q);
    const ruleMatch = rule.ruleId ? rule.ruleId.toLowerCase().includes(q) : false;
    return patternMatch || ruleMatch;
  });

  const columns: readonly AppColumn<UserDictionaryRule>[] = [
    {
      key: 'wordPattern',
      header: 'Word Pattern',
      render: (row) =>
        row.wordPattern ? <strong>"{row.wordPattern}"</strong> : <em>Any Word</em>,
    },
    {
      key: 'ruleId',
      header: 'Rule ID Excluded',
      render: (row) =>
        row.ruleId ? <AppChip label={row.ruleId} color="primary" /> : <em>None</em>,
    },
    {
      key: 'createdAt',
      header: 'Added On',
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <AppButton variantType="outlined" onClick={() => handleDelete(row.id)}>
          Delete Rule
        </AppButton>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.headerGroup}>
        <div>
          <h1 className={styles.title}>Personal Dictionary</h1>
          <p className={styles.subtitle}>
            Manage custom ignore patterns and rule suppression preferences.
          </p>
        </div>

        <Link href="/editor">
          <AppButton variantType="primary">Back to Editor</AppButton>
        </Link>
      </div>

      <div className={styles.toolbar}>
        <AppTextField
          placeholder="Search rule ID or word pattern..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredRules.length > 0 ? (
        <AppTable
          columns={columns}
          data={filteredRules}
          getRowId={(row) => row.id}
        />
      ) : (
        <AppCard elevated className={styles.emptyCard}>
          <h3 className={styles.emptyTitle}>No Custom Rules Found</h3>
          <p className={styles.emptyText}>
            You haven't added any custom dictionary rules yet. To ignore a rule, click "Always Ignore" inside the Workspace Editor popover menu.
          </p>
          <Link href="/editor">
            <AppButton variantType="primary">Open Workspace Editor</AppButton>
          </Link>
        </AppCard>
      )}
    </div>
  );
};
