'use client';

import React from 'react';
import { AuthProvider } from '@/features/auth/context/AuthContext';

export function Providers({ children }: { readonly children: React.ReactNode }): React.JSX.Element {
  return <AuthProvider>{children}</AuthProvider>;
}
