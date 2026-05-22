import prisma from '../config/db.js'

const cartInclude = {
  items: {
    include: { product: { include: { productcategory: true } } },
    orderBy: { createdAt: 'asc' },
  },
}

export const getOrCreateCart = async (userId) => {
  let cart = await prisma.cart.findUnique({ where: { userId }, include: cartInclude })
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId }, include: cartInclude })
  }
  return cart
}

export const addItemToCart = async (userId, productId, quantity = 1) => {
  const cart = await getOrCreateCart(userId)
  const existing = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId } },
  })
  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity },
    })
  } else {
    await prisma.cartItem.create({ data: { cartId: cart.id, productId, quantity } })
  }
  return getOrCreateCart(userId)
}

export const updateCartItem = async (userId, productId, quantity) => {
  const cart = await getOrCreateCart(userId)
  if (quantity <= 0) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id, productId } })
  } else {
    await prisma.cartItem.updateMany({ where: { cartId: cart.id, productId }, data: { quantity } })
  }
  return getOrCreateCart(userId)
}

export const removeCartItem = async (userId, productId) => {
  const cart = await getOrCreateCart(userId)
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id, productId } })
  return getOrCreateCart(userId)
}

export const clearCart = async (userId) => {
  const cart = await getOrCreateCart(userId)
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } })
  return getOrCreateCart(userId)
}
