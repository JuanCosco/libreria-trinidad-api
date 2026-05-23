import { Router } from 'express';
import * as BookController from '../controllers/book.controller';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Rutas públicas
router.get('/', BookController.getAll)
router.get('/:id', BookController.getById)

// Rutas protegidas (requieren autenticación y autorización de admin)
router.post('/', authenticate, authorizeAdmin, BookController.create)
router.patch('/:id', authenticate, authorizeAdmin, BookController.update)
router.delete('/:id', authenticate, authorizeAdmin, BookController.remove)

export default router