import prisma from "../config/db.js";

/* ── Get all products ── */
export const getAllProducts = async () => {
  return prisma.productMaster.findMany({
    orderBy: { id: "asc" },
    include: { productcategory: true },
  });
};

/* ── Get single product ── */
export const getProductById = async (id) => {
  const product = await prisma.productMaster.findUnique({
    where: { id: Number(id) },
    include: { productcategory: true },
  });
  if (!product) {
    const err = new Error("Product not found");
    err.status = 404;
    throw err;
  }
  return product;
};

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
    ratings,
  } = data;

  if (!productName || !productName.trim()) {
    const err = new Error("Product name is required");
    err.status = 400;
    throw err;
  }
  if (!productCategoryId) {
    const err = new Error("Category is required");
    err.status = 400;
    throw err;
  }
  if (!originalPrice) {
    const err = new Error("Original price is required");
    err.status = 400;
    throw err;
  }

  // Check category exists
  const cat = await prisma.productCategory.findUnique({
    where: { id: Number(productCategoryId) },
  });
  if (!cat) {
    const err = new Error("Selected category does not exist");
    err.status = 400;
    throw err;
  }

  return prisma.productMaster.create({
    data: {
      productName: productName.trim(),
      productImage: productImage || null,
      productCategoryId: parseInt(productCategoryId),
      productLabel: productLabel?.trim() || null,
      productDesc: productDesc?.trim() || null,
      productPrice: parseFloat(productPrice) || 0,
      originalPrice: parseFloat(originalPrice) || 0,
      discountPrice: parseFloat(discountPrice) || 0,
      productStatus:
        productStatus === undefined ? true : Boolean(productStatus),
      ratings: ratings !== undefined && ratings !== "" && ratings !== null ? parseInt(ratings) : null,
    },
  });
};

/* ── Update product ── */
export const updateProduct = async (id, data) => {
  const existing = await prisma.productMaster.findUnique({
    where: { id: Number(id) },
  });
  if (!existing) {
    const err = new Error("Product not found");
    err.status = 404;
    throw err;
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
    ratings,
  } = data;

  if (productCategoryId) {
    const cat = await prisma.productCategory.findUnique({
      where: { id: Number(productCategoryId) },
    });
    if (!cat) {
      const err = new Error("Selected category does not exist");
      err.status = 400;
      throw err;
    }
  }

  return prisma.productMaster.update({
    where: { id: Number(id) },
    data: {
      productName: productName ? productName.trim() : existing.productName,
      productImage:
        productImage !== undefined
          ? productImage || null
          : existing.productImage,
      productCategoryId: productCategoryId
        ? parseInt(productCategoryId)
        : existing.productCategoryId,
      productLabel:
        productLabel !== undefined
          ? productLabel?.trim() || null
          : existing.productLabel,
      productDesc:
        productDesc !== undefined
          ? productDesc?.trim() || null
          : existing.productDesc,
      productPrice:
        productPrice !== undefined
          ? parseFloat(productPrice)
          : existing.productPrice,
      originalPrice:
        originalPrice !== undefined
          ? parseFloat(originalPrice)
          : existing.originalPrice,
      discountPrice:
        discountPrice !== undefined
          ? parseFloat(discountPrice)
          : existing.discountPrice,
      productStatus:
        productStatus !== undefined
          ? Boolean(productStatus)
          : existing.productStatus,
      ratings:
        ratings !== undefined
          ? ratings !== "" && ratings !== null
            ? parseInt(ratings)
            : null
          : existing.ratings,
    },
  });
};

/* ── Delete product ── */
export const deleteProduct = async (id) => {
  const existing = await prisma.productMaster.findUnique({
    where: { id: Number(id) },
  });
  if (!existing) {
    const err = new Error("Product not found");
    err.status = 404;
    throw err;
  }
  await prisma.productMaster.delete({ where: { id: Number(id) } });
  return { message: "Product deleted successfully" };
};
