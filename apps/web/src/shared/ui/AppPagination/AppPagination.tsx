import React from 'react';
import Pagination, { PaginationProps } from '@mui/material/Pagination';
import styles from './AppPagination.module.css';

export interface AppPaginationProps extends Omit<PaginationProps, 'style' | 'sx'> {
  readonly customClassName?: string;
}

export const AppPagination: React.FC<AppPaginationProps> = ({
  count,
  page,
  onChange,
  customClassName = '',
  className = '',
  color = 'primary',
  shape = 'rounded',
  ...restProps
}) => {
  const combinedClassName = [styles.appPagination, customClassName, className]
    .filter(Boolean)
    .join(' ');

  return (
    <Pagination
      count={count}
      page={page}
      onChange={onChange}
      className={combinedClassName}
      color={color}
      shape={shape}
      {...restProps}
    />
  );
};
