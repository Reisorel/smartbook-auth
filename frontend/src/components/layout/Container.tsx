import type { ReactNode } from 'react';
import './Container.scss';

interface ContainerProps {
  children: ReactNode;
  size?: 'small' | 'medium' | 'large' | 'full';
  className?: string;
}

const Container = ({
  children,
  size = 'medium',
  className = '',
}: ContainerProps) => {
  const containerClassName = `
    container
    container--${size}
    ${className}
  `;

  return (
    <div className={containerClassName}>
      {children}
    </div>
  );
};

export default Container;
