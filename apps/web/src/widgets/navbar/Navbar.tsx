'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AppButton } from '@/shared/ui';
import { useAuth } from '@/features/auth/context/AuthContext';
import styles from './Navbar.module.css';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();

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
            {isAuthenticated && (
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
        {isAuthenticated ? (
          <>
            <span className={styles.userEmail}>{user?.email}</span>
            <AppButton variantType="secondary" onClick={logout}>
              Sign Out
            </AppButton>
          </>
        ) : (
          <AppButton variantType="primary" onClick={() => openAuthModal('login')}>
            Sign In
          </AppButton>
        )}
      </div>
    </header>
  );
};
