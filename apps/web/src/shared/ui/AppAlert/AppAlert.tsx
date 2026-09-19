import React from 'react';
import Alert, { AlertProps } from '@mui/material/Alert';
import styles from './AppAlert.module.css';

export interface AppAlertProps extends Omit<AlertProps, 'style' | 'sx'> {
  readonly customClassName?: string;
}

export const AppAlert: React.FC<AppAlertProps> = ({
  children,
  severity = 'info',
  customClassName = '',
  className = '',
  onClose,
  ...restProps
}) => {
  const getSeverityClass = (): string => {
    switch (severity) {
      case 'warning':
        return styles.appAlertWarning;
      case 'error':
        return styles.appAlertError;
      case 'success':
        return styles.appAlertSuccess;
      case 'info':
      default:
        return styles.appAlertInfo;
    }
  };

  const alertClass = [styles.appAlert, getSeverityClass(), customClassName, className]
    .filter(Boolean)
    .join(' ');

  return (
    <Alert
      severity={severity}
      className={alertClass}
      onClose={onClose}
      {...restProps}
    >
      {children}
    </Alert>
  );
};
