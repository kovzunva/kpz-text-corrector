'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AppButton } from '@/shared/ui';
import { useAuth } from '@/features/auth/context/AuthContext';
import styles from './Navbar.module.css';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={styles.navbarContainer}>
      <div className={styles.leftGroup}>
        <Link href="/" className={styles.brandLogo} onClick={closeMenu}>
          TextGuard Studio
        </Link>
        <nav className={styles.desktopNav}>
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

      {/* Mobile Hamburger Toggle Button */}
      <button
        className={`${styles.burgerButton} ${isMenuOpen ? styles.burgerOpen : ''}`}
        onClick={() => setIsMenuOpen((prev) => !prev)}
        aria-label="Toggle navigation menu"
      >
        <span className={styles.burgerBar} />
        <span className={styles.burgerBar} />
        <span className={styles.burgerBar} />
      </button>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className={styles.mobileDropdown}>
          <nav className={styles.mobileNav}>
            <Link
              href="/editor"
              className={`${styles.mobileNavLink} ${pathname === '/editor' ? styles.navLinkActive : ''}`}
              onClick={closeMenu}
            >
              Workspace Editor
            </Link>

            {isAuthenticated && (
              <Link
                href="/dictionary"
                className={`${styles.mobileNavLink} ${pathname === '/dictionary' ? styles.navLinkActive : ''}`}
                onClick={closeMenu}
              >
                Personal Dictionary
              </Link>
            )}
          </nav>

          <div className={styles.mobileActionsGroup}>
            {isAuthenticated ? (
              <>
                <span className={styles.mobileUserEmail}>{user?.email}</span>
                <AppButton
                  variantType="secondary"
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                >
                  Sign Out
                </AppButton>
              </>
            ) : (
              <AppButton
                variantType="primary"
                onClick={() => {
                  openAuthModal('login');
                  closeMenu();
                }}
              >
                Sign In
              </AppButton>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
