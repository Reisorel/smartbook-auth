import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useUser } from '../hooks/useUser';

// Le contexte exposera toutes les valeurs et méthodes retournées par useUser
type AuthContextType = ReturnType<typeof useUser>;

// Créer le contexte avec une valeur initiale undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // Utiliser le hook useUser pour fournir toutes les fonctionnalités d'authentification
  const userAuth = useUser();

  return (
    <AuthContext.Provider value={userAuth}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur de AuthProvider');
  }

  return context;
};
