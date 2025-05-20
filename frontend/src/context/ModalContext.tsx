// src/context/ModalContext.tsx
import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { AuthModal } from '../components/auth/AuthModal';

interface ModalState {
  isOpen: boolean;
  mode: 'login' | 'register';
}

interface ModalContextState {
  authModal: ModalState;
}

interface ModalContextActions {
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
}

type ModalContextType = ModalContextState & ModalContextActions;

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authModal, setAuthModal] = useState<ModalState>({
    isOpen: false,
    mode: 'login'
  });

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModal({ isOpen: true, mode });
  };

  const closeAuthModal = () => {
    setAuthModal(prev => ({ ...prev, isOpen: false }));
  };

  const value: ModalContextType = {
    authModal,
    openAuthModal,
    closeAuthModal
  };

  return (
    <ModalContext.Provider value={value}>
      {children}

      <AuthModal
        isOpen={authModal.isOpen}
        onClose={closeAuthModal}
        initialMode={authModal.mode}
      />
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);

  if (context === undefined) {
    throw new Error('useModal doit être utilisé à l\'intérieur d\'un ModalProvider');
  }

  return context;
};
