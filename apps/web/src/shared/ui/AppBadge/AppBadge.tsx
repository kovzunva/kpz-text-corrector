import React from 'react';
import Badge, { BadgeProps } from '@mui/material/Badge';
import styles from './AppBadge.module.css';

export interface AppBadgeProps extends Omit<BadgeProps, 'style' | 'sx'> {
  readonly customClassName?: string;
}

export const AppBadge: React.FC<AppBadgeProps> = ({
  children,
  badgeContent,
  color = 'primary',
  customClassName = '',
  className = '',
  ...restProps
}) => {
  const badgeClass = [styles.appBadge, customClassName, className]
    .filter(Boolean)
    .join(' ');

  return (
    <Badge
      badgeContent={badgeContent}
      color={color}
      className={badgeClass}
      {...restProps}
    >
      {children}
    </Badge>
  );
};
