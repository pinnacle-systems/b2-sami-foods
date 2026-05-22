import { Router } from 'express'
import { getAll, getAllAdmin, getOne, create, update, remove } from '../controllers/product.controller.js'
import adminAuth from '../middleware/adminAuth.js'
import { upload } from '../middleware/upload.js'

const router = Router()

router.get('/',         getAll)      // Public — active products only
router.get('/admin/all', adminAuth, getAllAdmin) // Admin — all products including inactive
router.get('/:id',      getOne)      // Public
router.post('/',        adminAuth, upload.single('productImage'), create)
router.put('/:id',      adminAuth, upload.single('productImage'), update)
router.delete('/:id',   adminAuth, remove)

export default router
