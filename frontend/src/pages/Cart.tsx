import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import CartList from '../features/carts/CartList';
import './Cart.scss';

const CartPage: React.FC = () => {
  const { isAuthenticated, loading } = useUser();

  // Redirection vers la page de connexion si l'utilisateur n'est pas authentifié
  if (!loading && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: '/cart' }} />;
  }

  return (
    <main className="cart-page">
      <div className="cart-page__container">
        <CartList />
      </div>
    </main>
  );
};

export default CartPage;
