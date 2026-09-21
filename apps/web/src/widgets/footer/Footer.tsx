import React from 'react';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footerContainer}>
      <p className={styles.footerContent}>
        TextGuard Studio — Advanced Multi-Pass Text Correction & Dictionary Synchronization Service.
      </p>
      <p className={styles.footerCopyright}>
        © {new Date().getFullYear()} TextGuard Studio. Built with Next.js App Router & NestJS.
      </p>
    </footer>
  );
};
