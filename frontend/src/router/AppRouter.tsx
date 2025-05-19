import { Routes, Route, Outlet } from 'react-router-dom';
import { Layout } from '../components/IndexComponents';
import BooksPage from '../pages/BooksPage';
import Home from '../pages/Home';

const AppRouter = () => {
  return (
    <Routes>
      <Route element={<Layout><Outlet /></Layout>}>
        {/* Routes fonctionnelles existantes */}
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<BooksPage />} />

        {/* Page 404 */}
        <Route path="*" element={<div>Page non trouvée</div>} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
