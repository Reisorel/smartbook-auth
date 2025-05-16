import { Router } from 'express';
import authRoutes from './auth.routes';
import bookRoutes from './book.routes';
import cartRoutes from './cart.routes';
import userRoutes from './user.routes';

const router = Router();

// Préfixe toutes les routes avec leur domaine fonctionnel
router.use('/auth', authRoutes);
router.use('/books', bookRoutes);
router.use('/cart', cartRoutes);
router.use('/users', userRoutes);

export default router;
