import { Router } from 'express'
import authRoutes from './auth.routes.js'

const router = Router()

router.use('/auth', authRoutes)

// Add more routes here:
// router.use('/products', productRoutes)
// router.use('/orders',   orderRoutes)

export default router
