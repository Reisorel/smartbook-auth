// BooksPage.tsx
import { FC, useState } from 'react';
import { BookList } from '../features/books/BookList';
import Toast from '../components/display/Toast';
import { useCart } from '../hooks/useCart';

const BooksPage: FC = () => {
  const { addToCart } = useCart();
  const [toast, setToast] = useState<{ visible: boolean, message: string, type: 'success' | 'error' | 'info' }>({
    visible: false,
    message: '',
    type: 'info'
  });

  const handleAddToCart = async (bookId: string) => {
    try {
      await addToCart(bookId, 1);
      setToast({
        visible: true,
        message: 'Livre ajouté au panier',
        type: 'success'
      });
    } catch (err) {
      setToast({
        visible: true,
        message: err instanceof Error ? err.message : 'Erreur lors de l\'ajout au panier',
        type: 'error'
      });
    }
  };

  return (
    <>
      <h1 className="books-page__title">Catalogue de livres</h1>
      <BookList onAddToCart={handleAddToCart} />

      {toast.visible && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.visible}
          onClose={() => setToast(prev => ({ ...prev, visible: false }))}
        />
      )}
    </>
  );
};

export default BooksPage;
