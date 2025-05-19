import type { FC } from 'react';
import { Button } from '../IndexComponents';
import type { Book } from '../../types/TypeIndex';
import './BookCard.scss';

// Utilisation directe des props au lieu de définir une interface
const BookCard: FC<{ book: Book; onAddToCart?: (bookId: string) => void }> = ({
  book,
  onAddToCart
}) => {
  const handleAddToCart = () => {
    if (onAddToCart && book.stock > 0) {
      onAddToCart(book.id);
    }
  };

  // Formater le prix avec 2 décimales
  const formattedPrice = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(book.price);

  return (
    <div className="book-card">
      <div className="book-card__image-container">
        <img
          src={book.coverUrl || '/images/placeholder-book.jpg'}
          alt={`Couverture de ${book.title}`}
          className="book-card__image"
        />
      </div>

      <div className="book-card__content">
        <h3 className="book-card__title">{book.title}</h3>
        <p className="book-card__author">par {book.author}</p>

        <div className="book-card__footer">
          <p className="book-card__price">{formattedPrice}</p>

          <div className="book-card__stock">
            <span className={`book-card__stock-indicator ${book.stock > 0 ? 'book-card__stock-indicator--in-stock' : 'book-card__stock-indicator--out-of-stock'}`}></span>
            <span className="book-card__stock-text">
              {book.stock > 0 ? `${book.stock} en stock` : 'Rupture de stock'}
            </span>
          </div>

          <Button
            variant="primary"
            size="small"
            onClick={handleAddToCart}
            fullWidth
            disabled={book.stock <= 0}
          >
            {book.stock > 0 ? 'Ajouter au panier' : 'Indisponible'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
