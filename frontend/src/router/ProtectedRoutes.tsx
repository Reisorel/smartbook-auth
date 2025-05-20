// src/components/auth/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { Loader } from '../components/IndexComponents';

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  adminOnly = false,
  redirectTo = '/login'
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader size="large" />;
  }

  if (!user) {
    // Rediriger vers la page de connexion avec l'URL actuelle comme destination après connexion
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    // Rediriger vers l'accueil si l'utilisateur n'est pas admin
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
