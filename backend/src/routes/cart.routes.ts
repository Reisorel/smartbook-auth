import { Router } from 'express';
import * as cartController from '../controllers/cart.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Toutes les routes de panier nécessitent une authentification
router.use(authenticate);

router.get('/', cartController.getCart);
router.post('/items', cartController.addItemToCart);
router.put('/items/:bookId', cartController.updateCartItem);
router.delete('/items/:bookId', cartController.removeCartItem);
router.delete('/', cartController.clearCart);

export default router;
