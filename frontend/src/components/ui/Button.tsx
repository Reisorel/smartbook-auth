import type { ReactNode, ButtonHTMLAttributes } from 'react';
import './Button.scss';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  icon?: ReactNode;
  isLoading?: boolean;
}

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  icon,
  isLoading = false,
  className = '',
  ...props
}: ButtonProps) => {
  const buttonClassName = `
    button
    button--${variant}
    button--${size}
    ${fullWidth ? 'button--full-width' : ''}
    ${isLoading ? 'button--loading' : ''}
    ${className}
  `;

  return (
    <button className={buttonClassName} disabled={isLoading || props.disabled} {...props}>
      {isLoading ? (
        <span className="button__loader"></span>
      ) : (
        <>
          {icon && <span className="button__icon">{icon}</span>}
          <span className="button__text">{children}</span>
        </>
      )}
    </button>
  );
};

export default Button;
