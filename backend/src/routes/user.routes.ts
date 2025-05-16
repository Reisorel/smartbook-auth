import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticate, isAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Routes nécessitant authentification
router.use(authenticate);

// Routes pour tous les utilisateurs (accès à son propre profil)
router.get('/me', userController.getProfile);
router.put('/me', userController.updateProfile);
router.delete('/me', userController.deleteProfile);

// Routes admin uniquement (gestion de tous les utilisateurs)
router.get('/', isAdmin, userController.getAllUsers);
router.get('/:id', isAdmin, userController.getUserById);
router.put('/:id', isAdmin, userController.updateUser);
router.delete('/:id', isAdmin, userController.deleteUser);

export default router;
