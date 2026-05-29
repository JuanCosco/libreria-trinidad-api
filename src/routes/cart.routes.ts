import { Router } from "express"
import * as CartController from "../controllers/cart.controller"
import { authenticate } from "../middlewares/auth.middleware"

const router = Router()

router.use(authenticate)

router.get('/', CartController.getCart)
router.post('/items', CartController.addToCart)
router.patch('/items/:bookId', CartController.updateCartItem)
router.delete('/items/:bookId', CartController.removeFromCart)
router.delete('/', CartController.clearCart)

export default router