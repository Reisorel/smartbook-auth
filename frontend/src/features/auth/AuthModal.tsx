import { useState } from 'react';
import Modal from '../ui/Modal';
import { LoginForm } from '../../features/auth/LoginForm';
import { RegisterForm } from '../../features/auth/RegisterForm';
import './AuthModal.scss';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal = ({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'login' ? 'Connexion' : 'Inscription'}>
      <div className="auth-modal">
        {mode === 'login' ? (
          <>
            <LoginForm onSuccess={onClose} />
            <div className="auth-modal__footer">
              <p>Pas encore de compte ?</p>
              <button className="auth-modal__switch" onClick={() => setMode('register')}>
                Créer un compte
              </button>
            </div>
          </>
        ) : (
          <>
            <RegisterForm onSuccess={onClose} />
            <div className="auth-modal__footer">
              <p>Déjà un compte ?</p>
              <button className="auth-modal__switch" onClick={() => setMode('login')}>
                Se connecter
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
