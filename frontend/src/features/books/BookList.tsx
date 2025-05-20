import { type FC } from 'react';
import BookCard from '../../components/display/BookCard';
import Loader from '../../components/ui/Loader';
import { useBook } from '../../hooks/useBook';
import type { Book } from '../../types/Book'; // Correct avec verbatimModuleSyntax
import './BookList.scss';

interface BookListProps {
  onAddToCart?: (bookId: string) => void;
}

export const BookList: FC<BookListProps> = ({ onAddToCart }) => {
  // Utiliser le hook directement dans la feature
  const { books, loading, error } = useBook();

  if (loading) {
    return <Loader size="large" text="Chargement des livres..." />;
  }

  if (error) {
    return <div className="book-list__error">Erreur: {error}</div>;
  }

  if (books.length === 0) {
    return <div className="book-list__empty">Aucun livre trouvé.</div>;
  }

  // Fonction pour convertir le format de Book
  const formatBook = (apiBook: any): Book => ({
    ...apiBook,
    // Convertir Date en string si nécessaire
    createdAt: typeof apiBook.createdAt === 'object' ? apiBook.createdAt.toISOString() : apiBook.createdAt,
    updatedAt: typeof apiBook.updatedAt === 'object' ? apiBook.updatedAt.toISOString() : apiBook.updatedAt
  });

  return (
    <div className="book-list">
      <div className="book-list__grid">
        {books.map(book => (
          <div key={book._id} className="book-list__item">
            <BookCard
              book={formatBook(book)}
              onAddToCart={onAddToCart ? () => onAddToCart(book._id) : undefined}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
