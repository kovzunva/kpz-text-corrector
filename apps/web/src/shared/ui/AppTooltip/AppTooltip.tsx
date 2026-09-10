import React from 'react';
import Tooltip, { TooltipProps } from '@mui/material/Tooltip';
import styles from './AppTooltip.module.css';
import { IssueCategory } from '@/shared/types/domain';

export interface AppTooltipProps extends Omit<TooltipProps, 'style' | 'sx'> {
  readonly category?: IssueCategory;
  readonly customClassName?: string;
}

export const AppTooltip: React.FC<AppTooltipProps> = ({
  children,
  title,
  category,
  customClassName = '',
  className = '',
  placement = 'bottom',
  open,
  onClose,
  arrow = true,
  ...restProps
}) => {
  const getCategoryClass = (): string => {
    switch (category) {
      case 'spelling':
        return styles.appTooltipSpelling;
      case 'grammar':
        return styles.appTooltipGrammar;
      case 'style':
        return styles.appTooltipStyle;
      case 'typography':
        return styles.appTooltipTypography;
      default:
        return '';
    }
  };

  const tooltipClass = [
    styles.appTooltipContent,
    getCategoryClass(),
    customClassName,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tooltip
      title={title}
      placement={placement}
      open={open}
      onClose={onClose}
      arrow={arrow}
      classes={{
        popper: styles.appTooltipPopper,
        tooltip: tooltipClass,
      }}
      {...restProps}
    >
      {children}
    </Tooltip>
  );
};
