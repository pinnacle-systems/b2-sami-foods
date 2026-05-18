import prisma from '../config/db.js'

/* ── Get all products ── */
export const getAllProducts = async () => {
  return prisma.productMaster.findMany({
    orderBy: { id: 'asc' },
    include: { productcategory: true },
  })
}

/* ── Get single product ── */
export const getProductById = async (id) => {
  const product = await prisma.productMaster.findUnique({
    where: { id: Number(id) },
    include: { productcategory: true },
  })
  if (!product) {
    const err = new Error('Product not found')
    err.status = 404
    throw err
  }
  return product
}

/* ── Create product ── */
export const createProduct = async (data) => {
  const {
    productName,
    productImage,
    productCategoryId,
    productLabel,
    productDesc,
    productPrice,
    originalPrice,
    discountPrice,
    productStatus,
  } = data

  if (!productName || !productName.trim()) {
    const err = new Error('Product name is required')
    err.status = 400
    throw err
  }
  if (!productCategoryId) {
    const err = new Error('Category is required')
    err.status = 400
    throw err
  }

  // Check category exists
  const cat = await prisma.productCategory.findUnique({
    where: { id: Number(productCategoryId) },
  })
  if (!cat) {
    const err = new Error('Selected category does not exist')
    err.status = 400
    throw err
  }

  return prisma.productMaster.create({
    data: {
      productName: productName.trim(),
      productImage: productImage || null,
      productCategoryId: Number(productCategoryId),
      productLabel: productLabel?.trim() || null,
      productDesc: productDesc?.trim() || null,
      productPrice: Number(productPrice) || 0,
      originalPrice: Number(originalPrice) || 0,
      discountPrice: Number(discountPrice) || 0,
      productStatus: productStatus === undefined ? true : Boolean(productStatus),
    },
  })
}

/* ── Update product ── */
export const updateProduct = async (id, data) => {
  const existing = await prisma.productMaster.findUnique({ where: { id: Number(id) } })
  if (!existing) {
    const err = new Error('Product not found')
    err.status = 404
    throw err
  }

  const {
    productName,
    productImage,
    productCategoryId,
    productLabel,
    productDesc,
    productPrice,
    originalPrice,
    discountPrice,
    productStatus,
  } = data

  if (productCategoryId) {
    const cat = await prisma.productCategory.findUnique({
      where: { id: Number(productCategoryId) },
    })
    if (!cat) {
      const err = new Error('Selected category does not exist')
      err.status = 400
      throw err
    }
  }

  return prisma.productMaster.update({
    where: { id: Number(id) },
    data: {
      productName: productName ? productName.trim() : existing.productName,
      productImage: productImage !== undefined ? (productImage || null) : existing.productImage,
      productCategoryId: productCategoryId ? Number(productCategoryId) : existing.productCategoryId,
      productLabel: productLabel !== undefined ? (productLabel?.trim() || null) : existing.productLabel,
      productDesc: productDesc !== undefined ? (productDesc?.trim() || null) : existing.productDesc,
      productPrice: productPrice !== undefined ? Number(productPrice) : existing.productPrice,
      originalPrice: originalPrice !== undefined ? Number(originalPrice) : existing.originalPrice,
      discountPrice: discountPrice !== undefined ? Number(discountPrice) : existing.discountPrice,
      productStatus: productStatus !== undefined ? Boolean(productStatus) : existing.productStatus,
    },
  })
}

/* ── Delete product ── */
export const deleteProduct = async (id) => {
  const existing = await prisma.productMaster.findUnique({ where: { id: Number(id) } })
  if (!existing) {
    const err = new Error('Product not found')
    err.status = 404
    throw err
  }
  await prisma.productMaster.delete({ where: { id: Number(id) } })
  return { message: 'Product deleted successfully' }
}
