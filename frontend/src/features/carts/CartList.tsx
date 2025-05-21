import React from 'react';
import { useCart } from '../../hooks/useCart';
import Loader from '../../components/ui/Loader';
import './CartList.scss';

export const CartList: React.FC = () => {
  const { cart, loading, error } = useCart();

  // États de chargement et d'erreur
  if (loading) return <Loader size="large" text="Chargement..." />;
  if (error) return <div className="cart-error">Erreur</div>;
  if (!cart || !cart.items || cart.items.length === 0) {
    return <div className="cart-empty">Panier vide</div>;
  }

  return (
    <div className="cart">
      <h2>Mon Panier</h2>
      <ul className="cart-items">
        {cart.items.map((item) => {
          const bookId = typeof item.bookId === 'object' ? item.bookId._id : item.bookId;
          const title = item.book?.title || "Livre sans titre";

          return (
            <li key={bookId} className="cart-item">
              <span className="cart-item__title">{title}</span>
              <span className="cart-item__quantity">×{item.quantity}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CartList;
