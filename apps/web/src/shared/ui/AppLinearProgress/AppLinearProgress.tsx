import React from 'react';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import styles from './AppLinearProgress.module.css';

export interface AppLinearProgressProps extends Omit<LinearProgressProps, 'style' | 'sx'> {
  readonly statusVariant?: 'normal' | 'warning' | 'danger';
  readonly customClassName?: string;
}

export const AppLinearProgress: React.FC<AppLinearProgressProps> = ({
  value,
  variant = 'determinate',
  statusVariant = 'normal',
  customClassName = '',
  className = '',
  ...restProps
}) => {
  const getStatusClass = (): string => {
    switch (statusVariant) {
      case 'warning':
        return styles.appLinearProgressWarning;
      case 'danger':
        return styles.appLinearProgressDanger;
      case 'normal':
      default:
        return '';
    }
  };

  const progressClass = [styles.appLinearProgress, getStatusClass(), customClassName, className]
    .filter(Boolean)
    .join(' ');

  return (
    <LinearProgress
      variant={variant}
      value={value}
      className={progressClass}
      {...restProps}
    />
  );
};
