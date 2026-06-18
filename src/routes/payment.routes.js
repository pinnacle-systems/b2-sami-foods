import { Router } from 'express';
import { createOrder, verifyPayment, getOrders, webhook } from '../controllers/payment.controller.js';
import auth from '../middleware/auth.js';

const router = Router();

router.post('/create-order', auth, createOrder);
router.post('/verify', auth, verifyPayment);
router.get('/orders', auth, getOrders);
router.post('/webhook', webhook); // No auth, verified by signature

export default router;
