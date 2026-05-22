import { Router } from 'express'
import authRoutes from './auth.routes.js'
import productCategoryRoutes from './productCategory.routes.js'
import productRoutes from './product.routes.js'
import cartRoutes from './cart.routes.js'
import wishlistRoutes from './wishlist.routes.js'

const router = Router()

router.use('/auth',               authRoutes)
router.use('/product-categories', productCategoryRoutes)
router.use('/products',           productRoutes)
router.use('/cart',               cartRoutes)
router.use('/wishlist',           wishlistRoutes)

export default router
