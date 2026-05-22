import { Router } from 'express'
import { getAll, getOne, create, update, remove } from '../controllers/productCategory.controller.js'
import adminAuth from '../middleware/adminAuth.js'
import { upload } from '../middleware/upload.js'

const router = Router()

router.get('/',        getAll)          // Public — storefront needs categories
router.get('/:id',     getOne)          // Public
router.post('/',       adminAuth, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'productCategoryImage', maxCount: 1 }
]), create)
router.put('/:id',     adminAuth, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'productCategoryImage', maxCount: 1 }
]), update)
router.delete('/:id',  adminAuth, remove)

export default router
