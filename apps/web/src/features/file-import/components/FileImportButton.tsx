import React, { useRef } from 'react';
import { AppButton } from '@/shared/ui';
import styles from './FileImportButton.module.css';

export interface FileImportButtonProps {
  readonly isGuest: boolean;
  readonly onGuestAttempt: () => void;
  readonly onTextExtracted: (text: string) => void;
  readonly onError?: (errorMessage: string) => void;
}

export const FileImportButton: React.FC<FileImportButtonProps> = ({
  isGuest,
  onGuestAttempt,
  onTextExtracted,
  onError,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (isGuest) {
      onGuestAttempt();
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${API_BASE_URL}/v1/files/extract`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as { message?: string };
        throw new Error(errorData.message || 'Failed to extract text from file');
      }

      const data = (await response.json()) as { extractedText: string };
      onTextExtracted(data.extractedText);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to import file';
      if (onError) {
        onError(msg);
      }
    } finally {
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  return (
    <>
      <AppButton variantType="outlined" onClick={handleClick}>
        Import Document
      </AppButton>
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.docx"
        className={styles.hiddenInput}
        onChange={handleFileChange}
      />
    </>
  );
};
