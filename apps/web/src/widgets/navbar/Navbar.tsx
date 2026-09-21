'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AppButton } from '@/shared/ui';
import styles from './Navbar.module.css';

export const Navbar: React.FC = () => {
  const pathname = usePathname();

  return (
    <header className={styles.navbarContainer}>
      <Link href="/" className={styles.brandLogo}>
        🛡️ TextGuard Studio
      </Link>

      <nav>
        <ul className={styles.navLinks}>
          <li>
            <Link
              href="/"
              className={`${styles.navLink} ${pathname === '/' ? styles.navLinkActive : ''}`}
            >
              Overview
            </Link>
          </li>
          <li>
            <Link
              href="/editor"
              className={`${styles.navLink} ${pathname === '/editor' ? styles.navLinkActive : ''}`}
            >
              Workspace Editor
            </Link>
          </li>
          <li>
            <Link
              href="/dictionary"
              className={`${styles.navLink} ${pathname === '/dictionary' ? styles.navLinkActive : ''}`}
            >
              Personal Dictionary
            </Link>
          </li>
        </ul>
      </nav>

      <div className={styles.actionsGroup}>
        <Link href="/editor">
          <AppButton variantType="primary">Launch Editor</AppButton>
        </Link>
      </div>
    </header>
  );
};
