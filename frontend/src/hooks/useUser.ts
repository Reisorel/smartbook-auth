import { useState, useEffect, useCallback } from 'react';
import { userApi, type User } from '../services/api/UserApi';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Vérifier l'utilisateur connecté au chargement
  const checkCurrentUser = useCallback(async () => {
    setLoading(true);

    try {
      if (!localStorage.getItem('auth_token')) {
        setUser(null);
        return;
      }

      const userData = await userApi.getCurrentUser();
      setUser(userData);
    } catch (err) {
      console.error("Erreur lors de la vérification de l'utilisateur actuel", err);
      // Si erreur d'authentification, on déconnecte l'utilisateur
      localStorage.removeItem('auth_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Vérifier l'utilisateur au chargement du composant
  useEffect(() => {
    checkCurrentUser();
  }, [checkCurrentUser]);

  // Connexion utilisateur
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const userData = await userApi.login(email, password);
      setUser(userData);
      return userData;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de la connexion";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Inscription utilisateur
  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const userData = await userApi.register(name, email, password);
      setUser(userData);
      return userData;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de l'inscription";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Déconnexion utilisateur
  const logout = () => {
    userApi.logout();
    setUser(null);
    setError(null);
  };

  // Mise à jour du profil utilisateur
  const updateProfile = async (userData: { name?: string, email?: string, password?: string }) => {
    setLoading(true);
    setError(null);

    try {
      const updatedUser = await userApi.updateUserProfile(userData);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de la mise à jour du profil";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Supprimer le compte utilisateur
  const deleteAccount = async () => {
    setLoading(true);
    setError(null);

    try {
      await userApi.deleteUserAccount();
      setUser(null);
      localStorage.removeItem('auth_token');
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de la suppression du compte";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fonctions admin
  const getAllUsers = async () => {
    if (!user || user.role !== 'admin') {
      throw new Error("Vous n'avez pas les droits d'administration nécessaires");
    }

    setLoading(true);
    setError(null);

    try {
      return await userApi.getAllUsers();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de la récupération des utilisateurs";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getUserById = async (userId: string) => {
    if (!user || user.role !== 'admin') {
      throw new Error("Vous n'avez pas les droits d'administration nécessaires");
    }

    setLoading(true);
    setError(null);

    try {
      return await userApi.getUserById(userId);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de la récupération de l'utilisateur";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: { name: string, email: string, password: string, role?: 'admin' | 'client' }) => {
    if (!user || user.role !== 'admin') {
      throw new Error("Vous n'avez pas les droits d'administration nécessaires");
    }

    setLoading(true);
    setError(null);

    try {
      return await userApi.createUser(userData);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de la création de l'utilisateur";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userId: string, userData: { name?: string, email?: string, password?: string, role?: 'admin' | 'client' }) => {
    if (!user || user.role !== 'admin') {
      throw new Error("Vous n'avez pas les droits d'administration nécessaires");
    }

    setLoading(true);
    setError(null);

    try {
      return await userApi.updateUser(userId, userData);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de la mise à jour de l'utilisateur";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!user || user.role !== 'admin') {
      throw new Error("Vous n'avez pas les droits d'administration nécessaires");
    }

    setLoading(true);
    setError(null);

    try {
      return await userApi.deleteUser(userId);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de la suppression de l'utilisateur";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    // États
    user,
    loading,
    error,

    // Propriétés dérivées
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',

    // Fonctions utilisateur standard
    login,
    register,
    logout,
    updateProfile,
    deleteAccount,
    checkCurrentUser,

    // Fonctions admin
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
  };
}
