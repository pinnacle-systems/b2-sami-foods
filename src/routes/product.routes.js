import { Router } from 'express'
import { getAll, getOne, create, update, remove } from '../controllers/product.controller.js'
import auth from '../middleware/auth.js'
import { upload } from '../middleware/upload.js'

const router = Router()

router.get('/',        getAll)                  // Public — storefront lists products
router.get('/:id',     getOne)                  // Public
router.post('/',       auth, upload.single('productImage'), create) // Admin only
router.put('/:id',     auth, upload.single('productImage'), update) // Admin only
router.delete('/:id',  auth, remove)            // Admin only

export default router
