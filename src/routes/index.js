import { Router } from 'express'
import authRoutes from './auth.routes.js'
import productCategoryRoutes from './productCategory.routes.js'
import productRoutes from './product.routes.js'
import cartRoutes from './cart.routes.js'
import wishlistRoutes from './wishlist.routes.js'
import uomRoutes from './uom.routes.js'
import paymentRoutes from './payment.routes.js'

const router = Router()

router.use('/auth',               authRoutes)
router.use('/product-categories', productCategoryRoutes)
router.use('/products',           productRoutes)
router.use('/cart',               cartRoutes)
router.use('/wishlist',           wishlistRoutes)
router.use('/uoms',               uomRoutes)
router.use('/payment',            paymentRoutes)

export default router
