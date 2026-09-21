import React from 'react';
import Chip, { ChipProps } from '@mui/material/Chip';
import styles from './AppChip.module.css';

export interface AppChipProps extends Omit<ChipProps, 'style' | 'sx'> {
  readonly customClassName?: string;
}

export const AppChip: React.FC<AppChipProps> = ({
  label,
  color = 'default',
  customClassName = '',
  className = '',
  onDelete,
  ...restProps
}) => {
  const chipClass = [
    styles.appChip,
    color === 'primary' ? styles.appChipPrimary : '',
    customClassName,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Chip
      label={label}
      className={chipClass}
      onDelete={onDelete}
      {...restProps}
    />
  );
};
