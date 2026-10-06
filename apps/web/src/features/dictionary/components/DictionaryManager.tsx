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
  AppAlert,
  AppModal,
} from '@/shared/ui';
import {
  fetchDictionaryRules,
  createDictionaryRule,
  deleteDictionaryRule,
} from '@/shared/api/dictionary.api';
import { UserDictionaryRule } from '@/shared/types/domain';
import { useAuth } from '@/features/auth/context/AuthContext';
import styles from './DictionaryManager.module.css';

export const DictionaryManager: React.FC = () => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const [rules, setRules] = useState<readonly UserDictionaryRule[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [newWord, setNewWord] = useState<string>('');
  const [newRuleId, setNewRuleId] = useState<string>('');
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [ruleToDelete, setRuleToDelete] = useState<UserDictionaryRule | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const loadRules = () => {
    if (isAuthenticated) {
      fetchDictionaryRules().then(setRules).catch(console.error);
    }
  };

  useEffect(() => {
    loadRules();
  }, [isAuthenticated]);

  const handleAddRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.trim() && !newRuleId.trim()) {
      setErrorMessage('Please enter a word pattern or rule ID to ignore.');
      return;
    }

    setIsAdding(true);
    setErrorMessage(null);

    try {
      await createDictionaryRule(newWord.trim() || undefined, newRuleId.trim() || undefined);
      setNewWord('');
      setNewRuleId('');
      loadRules();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to create dictionary rule';
      setErrorMessage(msg);
    } finally {
      setIsAdding(false);
    }
  };

  const confirmDelete = async () => {
    if (!ruleToDelete) return;
    setIsDeleting(true);
    const ok = await deleteDictionaryRule(ruleToDelete.id);
    if (ok) {
      setRules((prev) => prev.filter((r) => r.id !== ruleToDelete.id));
    }
    setIsDeleting(false);
    setRuleToDelete(null);
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
        <AppButton variantType="outlined" onClick={() => setRuleToDelete(row)}>
          Delete Rule
        </AppButton>
      ),
    },
  ];

  if (!isAuthenticated) {
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
            <AppButton variantType="secondary">Back to Editor</AppButton>
          </Link>
        </div>

        <AppCard elevated className={styles.emptyCard}>
          <h3 className={styles.emptyTitle}>Sign In Required</h3>
          <p className={styles.emptyText}>
            Personal dictionary rules are saved directly to your account. Please register or sign in to manage persistent ignore rules.
          </p>
          <AppButton variantType="primary" onClick={() => openAuthModal('register')}>
            Sign In / Register
          </AppButton>
        </AppCard>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerGroup}>
        <div>
          <h1 className={styles.title}>Personal Dictionary</h1>
          <p className={styles.subtitle}>
            Manage custom ignore patterns and rule suppression preferences saved to your account.
          </p>
        </div>

        <Link href="/editor">
          <AppButton variantType="secondary">Back to Editor</AppButton>
        </Link>
      </div>

      <AppCard elevated className={styles.addCard}>
        <h3 className={styles.addTitle}>Add Custom Ignore Rule</h3>
        {errorMessage && <AppAlert severity="error">{errorMessage}</AppAlert>}
        <form className={styles.addForm} onSubmit={handleAddRule}>
          <div className={styles.addInputs}>
            <AppTextField
              placeholder="Word to ignore (e.g. 'Kubernetes')..."
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
            />
            <AppTextField
              placeholder="Optional Rule ID to ignore..."
              value={newRuleId}
              onChange={(e) => setNewRuleId(e.target.value)}
            />
          </div>
          <AppButton variantType="primary" type="submit" disabled={isAdding}>
            {isAdding ? 'Adding Rule...' : 'Add Rule'}
          </AppButton>
        </form>
      </AppCard>

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
            You haven't added any custom dictionary rules yet. To ignore a rule, add a word above or click "Always Ignore" inside the Workspace Editor popover menu.
          </p>
          <Link href="/editor">
            <AppButton variantType="primary">Open Workspace Editor</AppButton>
          </Link>
        </AppCard>
      )}

      <AppModal
        open={Boolean(ruleToDelete)}
        onClose={() => setRuleToDelete(null)}
        title="Confirm Rule Deletion"
        actions={
          <>
            <AppButton variantType="secondary" onClick={() => setRuleToDelete(null)}>
              Cancel
            </AppButton>
            <AppButton variantType="primary" onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete Rule'}
            </AppButton>
          </>
        }
      >
        <p>
          Are you sure you want to delete the ignore rule for{' '}
          <strong>
            {ruleToDelete?.wordPattern ? `"${ruleToDelete.wordPattern}"` : ruleToDelete?.ruleId}
          </strong>
          ? The Workspace Editor will resume highlighting and checking for this pattern.
        </p>
      </AppModal>
    </div>
  );
};
