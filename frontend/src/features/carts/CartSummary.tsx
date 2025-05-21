import React from 'react';
import type { Cart } from '../../types/Cart';
import './CartSummary.scss';

interface CartSummaryProps {
  cart: Cart;
}

export const CartSummary: React.FC<CartSummaryProps> = ({ cart }) => {
  // Calcul du sous-total
  const subtotal = cart.items.reduce((total, item) => {
    return total + ((item.book?.price || 0) * item.quantity);
  }, 0);

  // Si vous avez des frais de livraison ou taxes, vous pourriez les ajouter ici
  const shipping = subtotal > 50 ? 0 : 4.95; // Exemple: livraison gratuite à partir de 50€
  const taxRate = 0.2; // TVA à 20%
  const taxAmount = subtotal * taxRate;
  const total = subtotal + shipping;

  return (
    <div className="cart-summary">
      <h2 className="cart-summary__title">Récapitulatif</h2>

      <div className="cart-summary__row">
        <span className="cart-summary__label">Sous-total</span>
        <span className="cart-summary__value">{subtotal.toFixed(2)} €</span>
      </div>

      <div className="cart-summary__row">
        <span className="cart-summary__label">TVA (20%)</span>
        <span className="cart-summary__value">{taxAmount.toFixed(2)} €</span>
      </div>

      <div className="cart-summary__row">
        <span className="cart-summary__label">Frais de livraison</span>
        <span className="cart-summary__value">
          {shipping === 0 ? 'Gratuit' : `${shipping.toFixed(2)} €`}
        </span>
      </div>

      <div className="cart-summary__divider"></div>

      <div className="cart-summary__row cart-summary__row--total">
        <span className="cart-summary__label">Total TTC</span>
        <span className="cart-summary__value cart-summary__value--total">
          {total.toFixed(2)} €
        </span>
      </div>

      <p className="cart-summary__info">
        Livraison gratuite à partir de 50€ d'achat
      </p>

      <div className="cart-summary__delivery">
        <h3 className="cart-summary__subtitle">Délai de livraison estimé</h3>
        <p className="cart-summary__delivery-time">2-4 jours ouvrables</p>
      </div>
    </div>
  );
};
