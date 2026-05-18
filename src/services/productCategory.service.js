import prisma from '../config/db.js'

/* ── Get all categories ── */
export const getAllCategories = async () => {
  return prisma.productCategory.findMany({
    orderBy: { id: 'asc' },
  })
}

/* ── Get single category by id ── */
export const getCategoryById = async (id) => {
  const category = await prisma.productCategory.findUnique({
    where: { id: Number(id) },
    include: { productMaster: true },
  })
  if (!category) {
    const err = new Error('Category not found')
    err.status = 404
    throw err
  }
  return category
}

/* ── Create category ── */
export const createCategory = async ({ name, description, image, productCategoryImage }) => {
  if (!name || !name.trim()) {
    const err = new Error('Category name is required')
    err.status = 400
    throw err
  }

  const exists = await prisma.productCategory.findFirst({ where: { name: name.trim() } })
  if (exists) {
    const err = new Error('Category with this name already exists')
    err.status = 409
    throw err
  }

  return prisma.productCategory.create({
    data: {
      name: name.trim(),
      description: description?.trim() || null,
      image: image || null,
      productCategoryImage: productCategoryImage || null,
    },
  })
}

/* ── Update category ── */
export const updateCategory = async (id, { name, description, image, productCategoryImage }) => {
  const existing = await prisma.productCategory.findUnique({ where: { id: Number(id) } })
  if (!existing) {
    const err = new Error('Category not found')
    err.status = 404
    throw err
  }

  if (name && name.trim()) {
    const duplicate = await prisma.productCategory.findFirst({
      where: { name: name.trim(), NOT: { id: Number(id) } },
    })
    if (duplicate) {
      const err = new Error('Another category with this name already exists')
      err.status = 409
      throw err
    }
  }

  return prisma.productCategory.update({
    where: { id: Number(id) },
    data: {
      ...(name && { name: name.trim() }),
      description: description?.trim() ?? existing.description,
      image: image ?? existing.image,
      productCategoryImage: productCategoryImage ?? existing.productCategoryImage,
    },
  })
}

/* ── Delete category ── */
export const deleteCategory = async (id) => {
  const existing = await prisma.productCategory.findUnique({ where: { id: Number(id) } })
  if (!existing) {
    const err = new Error('Category not found')
    err.status = 404
    throw err
  }

  // Check if products reference this category
  const productCount = await prisma.productMaster.count({ where: { productCategoryId: Number(id) } })
  if (productCount > 0) {
    const err = new Error(`Cannot delete: ${productCount} product(s) still belong to this category`)
    err.status = 400
    throw err
  }

  await prisma.productCategory.delete({ where: { id: Number(id) } })
  return { message: 'Category deleted successfully' }
}
