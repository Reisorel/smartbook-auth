const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'client';
  createdAt: Date;
  updatedAt: Date;
}

// Fonctions d'API utilisateur (incluant l'authentification)
export const userApi = {
  // AUTHENTIFICATION
  async login(email: string, password: string) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Erreur ${response.status}`);
    }

    const data = await response.json();
    localStorage.setItem('auth_token', data.token);
    return data.user;
  },

  async register(name: string, email: string, password: string) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Erreur ${response.status}`);
    }

    const data = await response.json();
    localStorage.setItem('auth_token', data.token);
    return data.user;
  },

  async logout() {
    localStorage.removeItem('auth_token');
  },

  // UTILISATEUR STANDARD - READ
  async getCurrentUser() {
    const token = localStorage.getItem('auth_token');
    if (!token) return null;

    const response = await fetch(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('auth_token');
        return null;
      }
      const error = await response.json();
      throw new Error(error.message || `Erreur ${response.status}`);
    }

    return response.json();
  },

  // UTILISATEUR STANDARD - UPDATE
  async updateUserProfile(userData: { name?: string, email?: string, password?: string }) {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('Non authentifié');

    const response = await fetch(`${API_URL}/users/me`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Erreur ${response.status}`);
    }

    return response.json();
  },

  // UTILISATEUR STANDARD - DELETE (suppression de son propre compte)
  async deleteUserAccount() {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('Non authentifié');

    const response = await fetch(`${API_URL}/users/me`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Erreur ${response.status}`);
    }

    localStorage.removeItem('auth_token');
    return response.json();
  },

  // ADMIN - READ (tous les utilisateurs)
  async getAllUsers() {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('Non authentifié');

    const response = await fetch(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Erreur ${response.status}`);
    }

    return response.json();
  },

  // ADMIN - READ (utilisateur spécifique)
  async getUserById(userId: string) {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('Non authentifié');

    const response = await fetch(`${API_URL}/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Erreur ${response.status}`);
    }

    return response.json();
  },

  // ADMIN - CREATE (créer un utilisateur)
  async createUser(userData: { name: string, email: string, password: string, role?: 'admin' | 'client' }) {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('Non authentifié');

    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Erreur ${response.status}`);
    }

    return response.json();
  },

  // ADMIN - UPDATE (modifier un utilisateur)
  async updateUser(userId: string, userData: { name?: string, email?: string, password?: string, role?: 'admin' | 'client' }) {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('Non authentifié');

    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Erreur ${response.status}`);
    }

    return response.json();
  },

  // ADMIN - DELETE (supprimer un utilisateur)
  async deleteUser(userId: string) {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('Non authentifié');

    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Erreur ${response.status}`);
    }

    return response.json();
  },

  // UTILITAIRES
  isAuthenticated() {
    return localStorage.getItem('auth_token') !== null;
  },

  async isAdmin() {
    try {
      const user = await this.getCurrentUser();
      return user && user.role === 'admin';
    } catch (error) {
      return false;
    }
  }
};