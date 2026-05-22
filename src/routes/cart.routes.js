import { Router } from 'express'
import auth from '../middleware/auth.js'
import * as cartController from '../controllers/cart.controller.js'

const router = Router()

router.use(auth)

router.get('/', cartController.getCart)
router.post('/items', cartController.addItem)
router.put('/items/:productId', cartController.updateItem)
router.delete('/items/:productId', cartController.removeItem)
router.delete('/', cartController.clearCart)

export default router
