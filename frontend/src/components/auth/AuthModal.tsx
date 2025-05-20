// src/components/auth/AuthModal.tsx
import { useState, useEffect } from 'react';
import { Modal } from '../IndexComponents';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import './AuthModal.scss';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login'
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Mettre à jour le mode si initialMode change
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'login' ? 'Connexion' : 'Inscription'}
      size="small"
    >
      <div className="auth-modal">
        {mode === 'login' ? (
          <LoginForm
            onSuccess={onClose}
            switchToRegister={() => setMode('register')}
          />
        ) : (
          <RegisterForm
            onSuccess={onClose}
            switchToLogin={() => setMode('login')}
          />
        )}
      </div>
    </Modal>
  );
};
