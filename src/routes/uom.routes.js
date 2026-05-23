import { Router } from 'express';
import { getAll, getOne, create, update, remove } from '../controllers/uom.controller.js';
import adminAuth from '../middleware/adminAuth.js';

const router = Router();

router.get('/',        getAll); // Public storefront can fetch UOMs
router.get('/:id',     getOne); // Public
router.post('/',       adminAuth, create); // Admin only
router.put('/:id',     adminAuth, update); // Admin only
router.delete('/:id',  adminAuth, remove); // Admin only

export default router;
