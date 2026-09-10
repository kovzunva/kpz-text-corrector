import React from 'react';
import Card, { CardProps } from '@mui/material/Card';
import styles from './AppCard.module.css';

export interface AppCardProps extends Omit<CardProps, 'style' | 'sx'> {
  readonly interactive?: boolean;
  readonly elevated?: boolean;
  readonly customClassName?: string;
}

export const AppCard: React.FC<AppCardProps> = ({
  children,
  interactive = false,
  elevated = false,
  customClassName = '',
  className = '',
  onClick,
  ...restProps
}) => {
  const combinedClassName = [
    styles.appCard,
    interactive ? styles.appCardInteractive : '',
    elevated ? styles.appCardElevated : '',
    customClassName,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Card
      elevation={0}
      className={combinedClassName}
      onClick={onClick}
      {...restProps}
    >
      {children}
    </Card>
  );
};
