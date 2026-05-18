import { Router } from 'express'
import { getAll, getOne, create, update, remove } from '../controllers/productCategory.controller.js'
import auth from '../middleware/auth.js'
import { upload } from '../middleware/upload.js'

const router = Router()

router.get('/',        getAll)          // Public — storefront needs categories
router.get('/:id',     getOne)          // Public
router.post('/',       auth, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'productCategoryImage', maxCount: 1 }
]), create)    // Admin only (auth guard)
router.put('/:id',     auth, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'productCategoryImage', maxCount: 1 }
]), update)    // Admin only
router.delete('/:id',  auth, remove)    // Admin only

export default router
