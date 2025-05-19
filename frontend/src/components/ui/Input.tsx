import { useState } from 'react';
import type { InputHTMLAttributes, ChangeEvent, FocusEvent } from 'react';
import './Input.scss';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  helperText?: string;
  icon?: React.ReactNode;
  onValueChange?: (value: string) => void;
}

const Input = ({
  label,
  error,
  size = 'medium',
  fullWidth = false,
  helperText,
  icon,
  className = '',
  id,
  onValueChange,
  onChange,
  onBlur,
  ...props
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-') || Math.random().toString(36).substring(2, 9)}`;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e);
    if (onValueChange) onValueChange(e.target.value);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const inputClassName = `
    input
    input--${size}
    ${fullWidth ? 'input--full-width' : ''}
    ${error ? 'input--error' : ''}
    ${isFocused ? 'input--focused' : ''}
    ${className}
  `;

  return (
    <div className={inputClassName}>
      {label && (
        <label htmlFor={inputId} className="input__label">
          {label}
        </label>
      )}

      <div className="input__wrapper">
        {icon && <div className="input__icon">{icon}</div>}

        <input
          id={inputId}
          className="input__field"
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          aria-invalid={!!error}
          {...props}
        />
      </div>

      {(error || helperText) && (
        <div className={`input__message ${error ? 'input__message--error' : ''}`}>
          {error || helperText}
        </div>
      )}
    </div>
  );
};

export default Input;
