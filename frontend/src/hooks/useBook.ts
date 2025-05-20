import { useState, useEffect, useCallback } from 'react';
import { bookApi } from '../services/api/BookApi';
import type { Book } from '../types/TypeIndex'; // Utiliser votre interface Book avec _id

export function useBook() {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Charger tous les livres
  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await bookApi.getAllBooks();
      setBooks(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors du chargement des livres";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger un livre par son ID
  const fetchBookById = useCallback(async (bookId: string) => {
    setLoading(true);
    setError(null);

    try {
      const book = await bookApi.getBookById(bookId);
      setSelectedBook(book);
      return book;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors du chargement du livre";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Créer un livre (admin uniquement)
  const createBook = async (bookData: { title: string, author: string, price: number, stock: number, coverUrl?: string, description?: string }) => {
    setLoading(true);
    setError(null);

    try {
      const newBook = await bookApi.createBook(bookData);
      setBooks(prevBooks => [...prevBooks, newBook]);
      return newBook;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de la création du livre";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour un livre (admin uniquement)
  const updateBook = async (bookId: string, bookData: { title?: string, author?: string, price?: number, stock?: number, coverUrl?: string, description?: string }) => {
    setLoading(true);
    setError(null);

    try {
      const updatedBook = await bookApi.updateBook(bookId, bookData);
      setBooks(prevBooks => prevBooks.map(book => book._id === bookId ? updatedBook : book));

      if (selectedBook?._id === bookId) {
        setSelectedBook(updatedBook);
      }

      return updatedBook;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de la mise à jour du livre";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un livre (admin uniquement)
  const deleteBook = async (bookId: string) => {
    setLoading(true);
    setError(null);

    try {
      await bookApi.deleteBook(bookId);
      setBooks(prevBooks => prevBooks.filter(book => book._id !== bookId));

      if (selectedBook?._id === bookId) {
        setSelectedBook(null);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de la suppression du livre";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Charger les livres au montage du composant
  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return {
    // États
    books,
    selectedBook,
    loading,
    error,

    // Méthodes
    fetchBooks,
    fetchBookById,
    createBook,
    updateBook,
    deleteBook
  };
}
