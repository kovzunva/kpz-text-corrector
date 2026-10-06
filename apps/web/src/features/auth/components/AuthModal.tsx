import React, { useState, useEffect } from 'react';
import { AppModal, AppButton, AppTextField, AppAlert } from '@/shared/ui';
import { loginApi, registerApi, AuthUser } from '@/shared/api/auth.api';
import styles from './AuthModal.module.css';

export interface AuthModalProps {
  readonly open: boolean;
  readonly mode: 'login' | 'register';
  readonly onClose: () => void;
  readonly onSwitchMode: (newMode: 'login' | 'register') => void;
  readonly onSuccess: (user: AuthUser) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  open,
  mode,
  onClose,
  onSwitchMode,
  onSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrorMessage(null);
  }, [open, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (mode === 'register') {
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }

      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }
    }

    setIsLoading(true);

    try {
      if (mode === 'login') {
        const response = await loginApi({ email, password });
        onSuccess(response.user);
        onClose();
      } else {
        const response = await registerApi({ email, password });
        onSuccess(response.user);
        onClose();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'An error occurred. Please try again.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const isLogin = mode === 'login';

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={isLogin ? 'Sign In to TextGuard Studio' : 'Create Free Account'}
      actions={
        <>
          <AppButton variantType="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </AppButton>
          <AppButton variantType="primary" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Processing...' : isLogin ? 'Sign In' : 'Register Free Account'}
          </AppButton>
        </>
      }
    >
      <form onSubmit={handleSubmit} className={styles.modalContent}>
        {errorMessage && <AppAlert severity="error">{errorMessage}</AppAlert>}

        <AppTextField
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <AppTextField
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {!isLogin && (
          <AppTextField
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        )}

        <div className={styles.switchText}>
          <span>{isLogin ? "Don't have an account?" : 'Already have an account?'}</span>
          <button
            type="button"
            className={styles.switchButton}
            onClick={() => onSwitchMode(isLogin ? 'register' : 'login')}
          >
            {isLogin ? 'Register free account' : 'Sign In'}
          </button>
        </div>
      </form>
    </AppModal>
  );
};
