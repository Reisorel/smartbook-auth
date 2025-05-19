import './Loader.scss';

type LoaderSize = 'small' | 'medium' | 'large';
type LoaderVariant = 'primary' | 'secondary' | 'white';

interface LoaderProps {
  size?: LoaderSize;
  variant?: LoaderVariant;
  fullWidth?: boolean;
  className?: string;
  text?: string;
}

const Loader = ({
  size = 'medium',
  variant = 'primary',
  fullWidth = false,
  className = '',
  text
}: LoaderProps) => {
  const loaderClassName = `
    loader
    loader--${size}
    loader--${variant}
    ${fullWidth ? 'loader--full-width' : ''}
    ${className}
  `;

  return (
    <div className={loaderClassName}>
      <div className="loader__spinner"></div>
      {text && <p className="loader__text">{text}</p>}
    </div>
  );
};

export default Loader;
