import { Router } from 'express'
import * as CategoryController from '../controllers/category.controller'
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware'

const router = Router()

// Rutas públicas
router.get('/', CategoryController.getAll)
router.get('/:id', CategoryController.getById)

// Rutas protegidas — solo ADMIN
router.post('/', authenticate, authorizeAdmin, CategoryController.create)
router.patch('/:id', authenticate, authorizeAdmin, CategoryController.update)
router.delete('/:id', authenticate, authorizeAdmin, CategoryController.remove)

export default router