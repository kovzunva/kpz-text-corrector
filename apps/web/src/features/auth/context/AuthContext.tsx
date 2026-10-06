'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser } from '@/shared/api/auth.api';
import { AuthModal } from '../components/AuthModal';

interface AuthContextType {
  readonly user: AuthUser | null;
  readonly isAuthenticated: boolean;
  readonly isAuthModalOpen: boolean;
  readonly authModalMode: 'login' | 'register';
  readonly openAuthModal: (mode?: 'login' | 'register') => void;
  readonly closeAuthModal: () => void;
  readonly logout: () => void;
  readonly setAuthUser: (user: AuthUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'textguard_user_session';

export const AuthProvider: React.FC<{ readonly children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (savedUser) {
        setUser(JSON.parse(savedUser) as AuthUser);
      }
    } catch (e) {
      console.error('Failed to parse saved user session', e);
    }
  }, []);

  const setAuthUser = (newUser: AuthUser) => {
    setUser(newUser);
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
    } catch (e) {
      console.error('Failed to save user session', e);
    }
  };

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to remove user session', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        logout,
        setAuthUser,
      }}
    >
      {children}
      <AuthModal
        open={isAuthModalOpen}
        mode={authModalMode}
        onClose={closeAuthModal}
        onSwitchMode={(newMode) => setAuthModalMode(newMode)}
        onSuccess={(newUser) => setAuthUser(newUser)}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
