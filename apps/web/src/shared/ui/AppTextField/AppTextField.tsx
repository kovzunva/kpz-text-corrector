import React from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import styles from './AppTextField.module.css';

export interface AppTextFieldProps extends Omit<TextFieldProps, 'style' | 'sx'> {
  readonly customClassName?: string;
  readonly labelText?: string;
}

export const AppTextField: React.FC<AppTextFieldProps> = ({
  labelText,
  customClassName = '',
  className = '',
  error,
  helperText,
  value,
  onChange,
  placeholder,
  type = 'text',
  multiline,
  rows,
  disabled,
  ...restProps
}) => {
  const inputClassName = [
    styles.appTextFieldInput,
    error ? styles.appTextFieldError : '',
    customClassName,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.appTextFieldWrapper}>
      {labelText && <label className={styles.appTextFieldLabel}>{labelText}</label>}
      <TextField
        variant="outlined"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        multiline={multiline}
        rows={rows}
        disabled={disabled}
        error={error}
        InputProps={{
          className: inputClassName,
        }}
        {...restProps}
      />
      {helperText && (
        <span
          className={`${styles.appTextFieldHelperText} ${
            error ? styles.appTextFieldErrorText : ''
          }`}
        >
          {helperText}
        </span>
      )}
    </div>
  );
};
