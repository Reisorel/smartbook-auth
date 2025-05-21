import React from 'react';
import { Link } from 'react-router-dom';
import type { CartItem as CartItemType } from '../../types/Cart';
import './CartItem.scss';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
  // Protection contre les données incomplètes
  if (!item.book || Object.keys(item.book).length === 0) {
    console.warn(`Article sans données de livre: ${item.bookId}`);
    return (
      <div className="cart-item cart-item--loading">
        <div className="cart-item__placeholder">Chargement des détails de l'article...</div>
        <button
          onClick={onRemove}
          className="cart-item__remove"
        >
          Supprimer
        </button>
      </div>
    );
  }

  // Constantes pour améliorer la lisibilité
  const { book, quantity, bookId } = item;
  const itemTotal = book.price * quantity;

  // Gestionnaires d'événements
  const handleDecrease = () => onUpdateQuantity(Math.max(1, quantity - 1));
  const handleIncrease = () => onUpdateQuantity(quantity + 1);

  return (
    <div className="cart-item">
      <div className="cart-item__image">
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={book.title}
            className="cart-item__cover"
          />
        ) : (
          <div className="cart-item__no-cover">
            <span>Pas d'image</span>
          </div>
        )}
      </div>

      <div className="cart-item__details">
        <Link to={`/books/${bookId}`} className="cart-item__title">
          {book.title}
        </Link>
        <div className="cart-item__price">Prix unitaire: {book.price.toFixed(2)} €</div>

        <div className="cart-item__controls">
          <div className="cart-item__quantity">
            <button
              onClick={handleDecrease}
              className="cart-item__btn cart-item__btn--decrease"
              disabled={quantity <= 1}
              aria-label="Diminuer la quantité"
            >
              -
            </button>
            <span className="cart-item__count">{quantity}</span>
            <button
              onClick={handleIncrease}
              className="cart-item__btn cart-item__btn--increase"
              aria-label="Augmenter la quantité"
            >
              +
            </button>
          </div>

          <span className="cart-item__total">
            Total: {itemTotal.toFixed(2)} €
          </span>
        </div>
      </div>

      <button
        onClick={onRemove}
        className="cart-item__remove"
        aria-label="Supprimer l'article"
      >
        Supprimer
      </button>
    </div>
  );
};
