import React, { useState, useEffect } from 'react';
import { useCart } from '../../hooks/useCart';
import Loader from '../../components/ui/Loader';
import './CartList.scss';
import type { Cart, CartItem } from '../../types/Cart'; // Importer les types Cart et CartItem
import type { Book } from '../../types/Book'; // Ajouter cette ligne pour importer le type Book

export const CartList: React.FC = () => {
  const {
    cart,
    loading,
    error,
    clearCart,
    updateCartItem,
    removeFromCart,
    fetchCart
  } = useCart();

  // État local pour suivre les opérations en cours par article
  const [processingItems, setProcessingItems] = useState<Record<string, boolean>>({});
  // État local pour gérer les quantités côté client
  const [localQuantities, setLocalQuantities] = useState<Record<string, number>>({});
  // État local pour maintenir une copie du panier pendant les opérations
  const [localCart, setLocalCart] = useState<Cart | null>(cart);

  // Initialiser les quantités locales à partir du panier
  useEffect(() => {
    if (cart && cart.items) {
      const quantities: Record<string, number> = {};
      cart.items.forEach(item => {
        // Assertion de type pour dire à TypeScript que c'est toujours un objet Book
        const bookObject = item.bookId as Book;
        quantities[bookObject._id] = item.quantity;
      });
      setLocalQuantities(quantities);
      setLocalCart(cart);
    }
  }, [cart]);

  // États de chargement et d'erreur
  if (loading) return <Loader size="large" text="Chargement..." />;
  if (error) return <div className="cart-error">{error}</div>;

  // Utiliser le panier local ou le panier du hook, selon lequel est disponible
  const currentCart = localCart || cart;
  if (!currentCart || !currentCart.items || !currentCart.items.length) {
    return <div className="cart-empty">Votre panier est vide</div>;
  }

  const handleClearCart = async () => {
    try {
      await clearCart();
      // Mettre à jour immédiatement le panier local
      setLocalCart(null);
    } catch (error) {
      console.error("Erreur lors de la suppression du panier:", error);
      fetchCart();
    }
  };

  // Fonction pour gérer les changements de quantité localement
  const handleLocalQuantityChange = (bookId: string, newQuantity: number) => {
    if (newQuantity >= 1 && localCart) {
      // Mettre à jour les quantités locales
      setLocalQuantities(prev => ({
        ...prev,
        [bookId]: newQuantity
      }));

      // Mettre à jour également le panier local pour éviter le flash "panier vide"
      setLocalCart(prevCart => {
        if (!prevCart) return prevCart;

        return {
          ...prevCart,
          items: prevCart.items.map(item => {
            // Maintenant bookId est toujours un objet Book avec une propriété _id
            if (item.bookId._id === bookId) {
              return { ...item, quantity: newQuantity };
            }
            return item;
          })
        };
      });
    }
  };

  // Fonction pour synchroniser avec le serveur
  const handleServerSync = async (bookId: string, quantity: number) => {
    if (quantity <= 0) return;

    try {
      setProcessingItems(prev => ({ ...prev, [bookId]: true }));
      await updateCartItem(bookId, quantity); // N'assignez pas le résultat si vous ne l'utilisez pas
      // Pas besoin de mettre à jour le panier local ici car l'effet ci-dessus le fera
    } catch (error) {
      console.error("Erreur lors de la mise à jour du panier:", error);
      fetchCart();
    } finally {
      setProcessingItems(prev => ({ ...prev, [bookId]: false }));
    }
  };

  // Gérer la suppression d'un article
  const handleRemoveItem = async (bookId: string) => {
    try {
      setProcessingItems(prev => ({ ...prev, [bookId]: true }));

      if (window.confirm("Êtes-vous sûr de vouloir supprimer cet article du panier ?")) {
        // Mettre à jour le panier local immédiatement pour éviter le flash "panier vide"
        if (localCart) {
          setLocalCart(prevCart => {
            if (!prevCart) return prevCart;

            return {
              ...prevCart,
              items: prevCart.items.filter(item => {
                // Utiliser l'assertion de type pour accéder à _id
                const itemBookId = (item.bookId as Book)._id;
                return itemBookId !== bookId;
              })
            };
          });
        }

        await removeFromCart(bookId);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'article:", error);
      fetchCart();
    } finally {
      setProcessingItems(prev => ({ ...prev, [bookId]: false }));
    }
  };

  return (
    <div className="cart">
      <div className="cart-header">
        <h2>Mon Panier</h2>
        <button
          onClick={handleClearCart}
          className="cart-clear-btn"
          disabled={loading}
        >
          Vider le panier
        </button>
      </div>
      <ul className="cart-items">
        {currentCart.items.map((item) => {
          // Gestion des deux cas possibles : bookId comme objet ou comme string
          const bookDetails = typeof item.bookId === 'object' ? item.bookId : item.book;
          const bookId = typeof item.bookId === 'object' ? item.bookId._id : item.bookId;
          const isProcessing = processingItems[bookId] || false;

          // Utiliser la quantité locale si disponible, sinon utiliser celle du panier
          const quantity = localQuantities[bookId] !== undefined ?
            localQuantities[bookId] : item.quantity;

          // Récupérer le titre et le prix depuis l'objet bookId ou book
          const title = bookDetails?.title || "Livre sans titre";
          const price = bookDetails?.price || 0;

          return (
            <li key={bookId} className="cart-item">
              <div className="cart-item__details">
                <span className="cart-item__title">{title}</span>
                <span className="cart-item__price">{price.toFixed(2)} €</span>
              </div>
              <div className="cart-item__controls">
                <div className="cart-item__quantity">
                  <button
                    className="quantity-btn"
                    onClick={() => {
                      const newQuantity = Math.max(1, quantity - 1);
                      handleLocalQuantityChange(bookId, newQuantity);
                      handleServerSync(bookId, newQuantity);
                    }}
                    disabled={loading || isProcessing || quantity <= 1}
                    aria-label="Diminuer la quantité"
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => {
                      const newQuantity = quantity + 1;
                      handleLocalQuantityChange(bookId, newQuantity);
                      handleServerSync(bookId, newQuantity);
                    }}
                    disabled={loading || isProcessing}
                    aria-label="Augmenter la quantité"
                  >
                    +
                  </button>
                </div>
                <button
                  className="cart-item__remove"
                  onClick={() => handleRemoveItem(bookId)}
                  disabled={loading || isProcessing}
                  aria-label="Supprimer l'article"
                >
                  ×
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="cart-footer">
        <div className="cart-total">
          <span>Total :</span>
          <span className="cart-total__price">
            {currentCart.items.reduce((total, item) => {
              const bookDetails = typeof item.bookId === 'object' ? item.bookId : item.book;
              const price = bookDetails?.price || 0;
              const bookId = typeof item.bookId === 'object' ? item.bookId._id : item.bookId;
              const quantity = localQuantities[bookId] !== undefined ?
                localQuantities[bookId] : item.quantity;
              return total + (price * quantity);
            }, 0).toFixed(2)} €
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartList;
