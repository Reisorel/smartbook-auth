import { Routes, Route, Outlet } from 'react-router-dom';
import { Layout } from '../components/IndexComponents';
import { ProtectedRoute } from './ProtectedRoutes';
import BooksPage from '../pages/BooksPage';
import Home from '../pages/Home';
import CartPage from '../pages/Cart'; // Importer la nouvelle page Cart

const AppRouter = () => {
  return (
    <Routes>
      <Route element={<Layout><Outlet /></Layout>}>
        {/* Routes fonctionnelles existantes */}
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<BooksPage />} />

        {/* Route protégée pour le panier */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />

        {/* Page 404 */}
        <Route path="*" element={<div>Page non trouvée</div>} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
