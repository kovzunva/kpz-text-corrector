'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AppButton } from '@/shared/ui';
import styles from './Navbar.module.css';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  // Guest mode by default; can be extended with auth status
  const isAuthorized = false;

  return (
    <header className={styles.navbarContainer}>
      <div className={styles.leftGroup}>
        <Link href="/" className={styles.brandLogo}>
          TextGuard Studio
        </Link>
        <nav>
          <ul className={styles.navLinks}>
            <li>
              <Link
                href="/editor"
                className={`${styles.navLink} ${pathname === '/editor' ? styles.navLinkActive : ''}`}
              >
                Workspace Editor
              </Link>
            </li>
            {isAuthorized && (
              <li>
                <Link
                  href="/dictionary"
                  className={`${styles.navLink} ${pathname === '/dictionary' ? styles.navLinkActive : ''}`}
                >
                  Personal Dictionary
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>

      <div className={styles.actionsGroup}>
        <AppButton variantType="primary">Sign In</AppButton>
      </div>
    </header>
  );
};
