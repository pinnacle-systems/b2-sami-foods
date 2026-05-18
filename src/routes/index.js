import { Router } from 'express'
import authRoutes from './auth.routes.js'
import productCategoryRoutes from './productCategory.routes.js'
import productRoutes from './product.routes.js'

const router = Router()

router.use('/auth',               authRoutes)
router.use('/product-categories', productCategoryRoutes)
router.use('/products',           productRoutes)

// Add more routes here:
// router.use('/orders',   orderRoutes)

export default router
