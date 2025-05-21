import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { CartItem } from './CartItem';
import { CartSummary } from './CartSummary';
import Loader from '../../components/ui/Loader';
import './CartItemList.scss';

export const CartItemList: React.FC = () => {
  const {
    cart,
    loading,
    error,
    updateCartItem,
    removeFromCart,
    clearCart
  } = useCart();

  if (loading) {
    return <Loader size="large" text="Chargement du panier..." />;
  }

  if (error) {
    return <div className="cart-list__error">Erreur: {error}</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="cart-list__empty">
        <h2>Votre panier est vide</h2>
        <p>Découvrez notre sélection de livres et ajoutez-en à votre panier.</p>
        <Link to="/" className="btn btn-primary">
          Explorer la librairie
        </Link>
      </div>
    );
  }

  console.log('Cart data:', cart);
  console.log('Cart items:', cart.items);
  console.log('Items with book data:', cart.items.filter(item => item.book));

  return (
    <div className="cart-container">
      <h1>Mon Panier</h1>

      <div className="cart-header">
        <span>{cart.items.length} article(s) dans votre panier</span>
        <button
          onClick={() => clearCart()}
          className="btn-clear"
        >
          Vider le panier
        </button>
      </div>

      <div className="cart-items">
        {cart.items.map(item => (
          <CartItem
            key={item.bookId}
            item={item}
            onUpdateQuantity={(quantity) => updateCartItem(item.bookId, quantity)}
            onRemove={() => removeFromCart(item.bookId)}
          />
        ))}
      </div>

      <CartSummary cart={cart} />

      <div className="cart-actions">
        <Link to="/" className="btn btn-secondary">
          Continuer mes achats
        </Link>
        <Link to="/checkout" className="btn btn-success">
          Passer la commande
        </Link>
      </div>
    </div>
  );
};
