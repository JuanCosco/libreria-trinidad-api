import { Router } from 'express'
import * as OrderController from '../controllers/order.controller'
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware'

const router = Router()

router.use(authenticate)

// Rutas para usuarios autenticados
router.get('/my', OrderController.getMyOrders)
router.get('/:id', OrderController.getById)
router.post('/', OrderController.createFromCart)

// Rutas para administradores
router.get('/', authorizeAdmin, OrderController.getAll)
router.patch('/:id/status', authorizeAdmin, OrderController.updateStatus)

export default router