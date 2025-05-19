import { useEffect, useRef, useState } from 'react';
import type { FC, ReactNode } from 'react';
import { Button } from '../IndexComponents';
import './Modal.scss';

// Typage direct dans le composant car spécifique à ce composant
const Modal: FC<{
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'small' | 'medium' | 'large';
  children: ReactNode;
  closeOnClickOutside?: boolean;
  showCloseButton?: boolean;
}> = ({
  isOpen,
  onClose,
  title,
  size = 'medium',
  children,
  closeOnClickOutside = true,
  showCloseButton = true
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Gestion de l'ouverture/fermeture avec animation
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = 'hidden'; // Empêche le scroll en arrière-plan
    } else {
      setTimeout(() => {
        setIsAnimating(false);
        document.body.style.overflow = ''; // Réactive le scroll
      }, 300); // Durée de l'animation de fermeture
    }

    // Nettoyage lors du démontage
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Fermeture avec la touche Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Clic en dehors du modal
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnClickOutside && modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen && !isAnimating) return null;

  return (
    <div
      className={`modal-backdrop ${isOpen ? 'modal-backdrop--active' : ''}`}
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={modalRef}
        className={`modal modal--${size} ${isOpen ? 'modal--active' : ''}`}
      >
        {(title || showCloseButton) && (
          <div className="modal__header">
            {title && <h2 className="modal__title">{title}</h2>}
            {showCloseButton && (
              <Button
                variant="text"
                onClick={onClose}
                className="modal__close-btn"
                aria-label="Fermer"
              >
                ✕
              </Button>
            )}
          </div>
        )}

        <div className="modal__content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
