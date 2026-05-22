import prisma from '../config/db.js'

export const getWishlist = async (userId) => {
  return prisma.wishlist.findMany({
    where: { userId },
    include: { product: { include: { productcategory: true } } },
    orderBy: { createdAt: 'desc' },
  })
}

export const toggleWishlistItem = async (userId, productId) => {
  const existing = await prisma.wishlist.findUnique({
    where: { userId_productId: { userId, productId } },
  })
  if (existing) {
    await prisma.wishlist.delete({ where: { id: existing.id } })
    return { added: false }
  }
  await prisma.wishlist.create({ data: { userId, productId } })
  return { added: true }
}
