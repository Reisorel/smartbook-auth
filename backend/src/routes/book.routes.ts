import { Router } from 'express';
import * as bookController from '../controllers/book.controller';
import { authenticate, isAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Routes publiques
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);

// Routes protégées (admin seulement)
router.post('/', authenticate, isAdmin, bookController.createBook);
router.put('/:id', authenticate, isAdmin, bookController.updateBook);
router.delete('/:id', authenticate, isAdmin, bookController.deleteBook);

export default router;
