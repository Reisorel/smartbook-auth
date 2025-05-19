import { useEffect, useState } from 'react';
import type { FC } from 'react';
import './Toast.scss';

// Utilisation d'un typage direct car spécifique à ce composant
const Toast: FC<{
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose: () => void;
  isVisible: boolean;
}> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
  isVisible
}) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Démarrer le timer pour fermer automatiquement
      const timer = setTimeout(() => {
        setIsExiting(true);
        // Attendre que l'animation de sortie soit terminée
        setTimeout(() => {
          setIsExiting(false);
          onClose();
        }, 300);
      }, duration);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible && !isExiting) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  return (
    <div
      className={`toast toast--${type} ${isVisible ? 'toast--visible' : ''} ${isExiting ? 'toast--exiting' : ''}`}
      role="alert"
    >
      <div className="toast__icon">
        {getIcon()}
      </div>
      <div className="toast__message">{message}</div>
      <button
        className="toast__close"
        onClick={() => {
          setIsExiting(true);
          setTimeout(() => {
            setIsExiting(false);
            onClose();
          }, 300);
        }}
        aria-label="Fermer"
      >
        ✕
      </button>
    </div>
  );
};

export default Toast;
