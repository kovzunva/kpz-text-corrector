import React from 'react';
import type { Metadata } from 'next';
import { Navbar } from '@/widgets/navbar/Navbar';
import { Footer } from '@/widgets/footer/Footer';
import styles from './layout.module.css';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'TextGuard Studio',
  description: 'Interactive text correction and dictionary management web service',
};

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}): React.JSX.Element {
  return (
    <html lang="en">
      <body className={styles.layoutBody}>
        <Navbar />
        <div className={styles.contentWrapper}>{children}</div>
        <Footer />
      </body>
    </html>
  );
}
