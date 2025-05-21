import { useState, useEffect, useCallback } from 'react';
import { cartApi } from '../services/api/CartApi';
import type { Cart } from '../types/Cart';

export function useCart() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Récupérer le panier de l'utilisateur
  const fetchCart = useCallback(async () => {
    // Vérification si l'utilisateur est connecté
    if (!localStorage.getItem('auth_token')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const cartData = await cartApi.getCart();
      setCart(cartData);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors du chargement du panier";
      setError(message);
      console.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Ajouter un élément au panier
  const addToCart = async (bookId: string, quantity: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      const updatedCart = await cartApi.addItem(bookId, quantity);
      setCart(updatedCart);
      return updatedCart;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de l'ajout au panier";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour la quantité d'un élément
  const updateCartItem = async (bookId: string, quantity: number) => {
    setLoading(true);
    setError(null);

    try {
      const updatedCart = await cartApi.updateItem(bookId, quantity);
      setCart(updatedCart);
      return updatedCart;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de la mise à jour du panier";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un élément du panier
  const removeFromCart = async (bookId: string) => {
    setLoading(true);
    setError(null);

    try {
      const updatedCart = await cartApi.removeItem(bookId);
      setCart(updatedCart);
      return updatedCart;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de la suppression de l'article";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Vider le panier
  const clearCart = async () => {
    setLoading(true);
    setError(null);

    try {
      const emptyCart = await cartApi.clearCart();
      setCart(emptyCart);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors du vidage du panier";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Calculer le nombre total d'articles dans le panier
  const getItemCount = useCallback(() => {
    if (!cart) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  // Calculer le prix total du panier
  const getTotalPrice = useCallback(() => {
    if (!cart?.items || cart.items.length === 0) return 0;

    return cart.items.reduce((total, item) => {
      // Gestion des deux cas possibles : bookId comme objet ou comme book
      const bookDetails = typeof item.bookId === 'object' ? item.bookId : item.book;
      const bookPrice = bookDetails?.price || 0;

      return total + (bookPrice * item.quantity);
    }, 0);
  }, [cart]);

  // Charger le panier au montage du composant
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return {
    // États
    cart,
    loading,
    error,

    // Méthodes principales (CRUD)
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,

    // Méthodes utilitaires
    getItemCount,
    getTotalPrice
  };
}
