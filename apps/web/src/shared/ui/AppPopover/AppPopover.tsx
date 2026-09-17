import React from 'react';
import Popover, { PopoverProps } from '@mui/material/Popover';
import styles from './AppPopover.module.css';

export interface AppPopoverProps extends Omit<PopoverProps, 'style' | 'sx'> {
  readonly customClassName?: string;
}

export const AppPopover: React.FC<AppPopoverProps> = ({
  children,
  open,
  anchorEl,
  onClose,
  anchorOrigin = { vertical: 'bottom', horizontal: 'left' },
  transformOrigin = { vertical: 'top', horizontal: 'left' },
  customClassName = '',
  className = '',
  ...restProps
}) => {
  const paperClass = [styles.appPopoverPaper, customClassName, className]
    .filter(Boolean)
    .join(' ');

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
      PaperProps={{
        className: paperClass,
      }}
      {...restProps}
    >
      {children}
    </Popover>
  );
};
