import prisma from "../config/db.js";

/* ── Get all UOMs ── */
export const getAllUoms = async () => {
  return prisma.uom.findMany({
    orderBy: { id: "asc" },
  });
};

/* ── Get single UOM by id ── */
export const getUomById = async (id) => {
  const uom = await prisma.uom.findUnique({
    where: { id: Number(id) },
  });
  if (!uom) {
    const err = new Error("UOM not found");
    err.status = 404;
    throw err;
  }
  return uom;
};

/* ── Create UOM ── */
export const createUom = async ({ name, shortCode, status }) => {
  if (!name || !name.trim()) {
    const err = new Error("UOM name is required");
    err.status = 400;
    throw err;
  }
  if (!shortCode || !shortCode.trim()) {
    const err = new Error("Short code is required");
    err.status = 400;
    throw err;
  }

  // Check unique name constraint
  const nameExists = await prisma.uom.findFirst({
    where: { name: name.trim() },
  });
  if (nameExists) {
    const err = new Error("UOM with this name already exists");
    err.status = 409;
    throw err;
  }

  // Check unique short code constraint
  const codeExists = await prisma.uom.findFirst({
    where: { shortCode: shortCode.trim() },
  });
  if (codeExists) {
    const err = new Error("UOM with this short code already exists");
    err.status = 409;
    throw err;
  }

  return prisma.uom.create({
    data: {
      name: name.trim(),
      shortCode: shortCode.trim(),
      status: status !== undefined ? Boolean(status) : true,
    },
  });
};

/* ── Update UOM ── */
export const updateUom = async (id, { name, shortCode, status }) => {
  const existing = await prisma.uom.findUnique({
    where: { id: Number(id) },
  });
  if (!existing) {
    const err = new Error("UOM not found");
    err.status = 404;
    throw err;
  }

  if (name && name.trim()) {
    const duplicateName = await prisma.uom.findFirst({
      where: { name: name.trim(), NOT: { id: Number(id) } },
    });
    if (duplicateName) {
      const err = new Error("Another UOM with this name already exists");
      err.status = 409;
      throw err;
    }
  }

  if (shortCode && shortCode.trim()) {
    const duplicateCode = await prisma.uom.findFirst({
      where: { shortCode: shortCode.trim(), NOT: { id: Number(id) } },
    });
    if (duplicateCode) {
      const err = new Error("Another UOM with this short code already exists");
      err.status = 409;
      throw err;
    }
  }

  return prisma.uom.update({
    where: { id: Number(id) },
    data: {
      ...(name && { name: name.trim() }),
      ...(shortCode && { shortCode: shortCode.trim() }),
      ...(status !== undefined && { status: Boolean(status) }),
    },
  });
};

/* ── Delete UOM ── */
export const deleteUom = async (id) => {
  const existing = await prisma.uom.findUnique({
    where: { id: Number(id) },
  });
  if (!existing) {
    const err = new Error("UOM not found");
    err.status = 404;
    throw err;
  }

  // Ensure no products reference this UOM (productUom)
  const productUomCount = await prisma.productMaster.count({
    where: { productuomId: Number(id) },
  });

  if (productUomCount > 0) {
    const err = new Error(
      `Cannot delete: UOM is still referenced by ${productUomCount} product(s)`
    );
    err.status = 400;
    throw err;
  }

  await prisma.uom.delete({ where: { id: Number(id) } });
  return { message: "UOM deleted successfully" };
};
