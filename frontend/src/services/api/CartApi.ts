const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Types correspondant au modèle cart.model.ts
export interface CartItem {
  bookId: string; // Sous forme de string pour le frontend
  quantity: number;
  book?: {
    id: string;
    title: string;
    price: number;
    // autres propriétés du livre dont vous avez besoin
  };
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

// Fonctions d'API pour le panier
export const cartApi = {
  // Obtenir le panier de l'utilisateur
  async getCart() {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('Non authentifié');
    
    const response = await fetch(`${API_URL}/cart`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Erreur ${response.status}`);
    }
    
    return response.json();
  },
  
  // Ajouter un élément au panier
  async addItem(bookId: string, quantity: number = 1) {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('Non authentifié');
    
    const response = await fetch(`${API_URL}/cart/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ bookId, quantity })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Erreur ${response.status}`);
    }
    
    return response.json();
  },
  
  // Mettre à jour la quantité d'un élément
  async updateItem(bookId: string, quantity: number) {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('Non authentifié');
    
    const response = await fetch(`${API_URL}/cart/items/${bookId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ quantity })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Erreur ${response.status}`);
    }
    
    return response.json();
  },
  
  // Supprimer un élément du panier
  async removeItem(bookId: string) {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('Non authentifié');
    
    const response = await fetch(`${API_URL}/cart/items/${bookId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Erreur ${response.status}`);
    }
    
    return response.json();
  },
  
  // Vider le panier
  async clearCart() {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('Non authentifié');
    
    const response = await fetch(`${API_URL}/cart`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Erreur ${response.status}`);
    }
    
    return response.json();
  }
};