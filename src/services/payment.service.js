import Razorpay from 'razorpay';
import crypto from 'crypto';
import prisma from '../config/db.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrderService = async ({ userId, totalAmount, items, addressId }) => {
  // Create order in Razorpay
  const options = {
    amount: Math.round(totalAmount * 100), // amount in the smallest currency unit
    currency: "INR",
    receipt: `receipt_${Date.now()}`
  };

  const razorpayOrder = await razorpay.orders.create(options);

  // Save order in our database
  const newOrder = await prisma.order.create({
    data: {
      userId,
      totalAmount,
      addressId: addressId ? Number(addressId) : null,
      razorpayOrderId: razorpayOrder.id,
      items: {
        create: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        }))
      }
    }
  });

  return { order: newOrder, razorpayOrder };
};

export const verifyPaymentService = async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Payment is successful
    const updatedOrder = await prisma.order.update({
      where: { razorpayOrderId: razorpay_order_id },
      data: {
        status: 'PAID',
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature
      }
    });

    // Clear the user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId: updatedOrder.userId }
    });

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id }
      });
    }

    return true;
  } else {
    throw Object.assign(new Error("Invalid signature"), { status: 400 });
  }
};

export const getOrdersService = async (userId) => {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            select: { productName: true, productImage: true }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  return orders;
};

export const getAllOrdersAdminService = async () => {
  const orders = await prisma.order.findMany({
    include: {
      user: { select: { name: true, email: true, mobile: true } },
      address: true,
      items: {
        include: {
          product: { select: { productName: true, productImage: true } }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  return orders;
};

export const updateDeliveryStatusService = async ({ id, deliveryStatus }) => {
  if (!deliveryStatus) {
    throw Object.assign(new Error("deliveryStatus is required"), { status: 400 });
  }

  const updatedOrder = await prisma.order.update({
    where: { id: Number(id) },
    data: { deliveryStatus }
  });
  
  return updatedOrder;
};

export const webhookService = async ({ signature, body, secret }) => {
  if (!secret) return "Webhook secret not configured";

  const shasum = crypto.createHmac('sha256', secret);
  shasum.update(JSON.stringify(body));
  const digest = shasum.digest('hex');

  if (digest === signature) {
    const event = body.event;
    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = body.payload.payment.entity;
      const razorpayOrderId = paymentEntity.order_id;
      const razorpayPaymentId = paymentEntity.id;
      
      const order = await prisma.order.findUnique({ where: { razorpayOrderId } });
      if (order && order.status !== 'PAID') {
        await prisma.order.update({
          where: { razorpayOrderId },
          data: {
            status: 'PAID',
            razorpayPaymentId
          }
        });
        
        // Clear cart
        const cart = await prisma.cart.findUnique({
          where: { userId: order.userId }
        });

        if (cart) {
          await prisma.cartItem.deleteMany({
            where: { cartId: cart.id }
          });
        }
      }
    }
    return "ok";
  } else {
    throw Object.assign(new Error("Invalid signature"), { status: 400 });
  }
};
