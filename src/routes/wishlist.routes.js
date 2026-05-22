import { Router } from 'express'
import auth from '../middleware/auth.js'
import * as wishlistController from '../controllers/wishlist.controller.js'

const router = Router()

router.use(auth)

router.get('/', wishlistController.getWishlist)
router.post('/:productId', wishlistController.toggleWishlist)

export default router
