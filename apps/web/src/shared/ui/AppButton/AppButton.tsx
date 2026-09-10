import React from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import styles from './AppButton.module.css';

export interface AppButtonProps extends Omit<ButtonProps, 'style' | 'sx'> {
  readonly variantType?: 'primary' | 'secondary' | 'outlined';
  readonly customClassName?: string;
}

export const AppButton: React.FC<AppButtonProps> = ({
  children,
  variantType = 'primary',
  customClassName = '',
  className = '',
  fullWidth,
  disabled,
  onClick,
  type = 'button',
  startIcon,
  endIcon,
  ...restProps
}) => {
  const getVariantClass = (): string => {
    switch (variantType) {
      case 'secondary':
        return styles.appButtonSecondary;
      case 'outlined':
        return styles.appButtonOutlined;
      case 'primary':
      default:
        return styles.appButtonPrimary;
    }
  };

  const combinedClassName = [
    styles.appButton,
    getVariantClass(),
    fullWidth ? styles.appButtonFullWidth : '',
    customClassName,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Button
      disableRipple
      className={combinedClassName}
      disabled={disabled}
      onClick={onClick}
      type={type}
      startIcon={startIcon}
      endIcon={endIcon}
      {...restProps}
    >
      {children}
    </Button>
  );
};
