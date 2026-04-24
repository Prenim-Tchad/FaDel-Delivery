import prisma from '../../config/prisma.js';

const createProduct = async (data) => {
  return await prisma.product.create({
    data: {
      partnerProfileId: data.partnerProfileId,
      menuId: data.menuId || null,
      type: data.type,
      name: data.name,
      price: data.price,
      isActive: data.isActive ?? true,
      label: data.label,
      formatKg: data.formatKg,
      stockFull: data.stockFull,
    },
  });
};

const getProducts = async (filters) => {
  return await prisma.product.findMany({
    where: {
      isActive: true,
      ...(filters.type && { type: filters.type }),
      ...(filters.partnerId && { partnerProfileId: filters.partnerId }),
    },
    include: {
      partnerProfile: true,
      menu: true,
    },
  });
};

const getAllProducts = async (filters) => {
  return await prisma.product.findMany({
    where: {
      isActive: true,
      ...(filters.type && { type: filters.type }),
      ...(filters.label && { label: filters.label }),
      ...(filters.partnerId && { partnerProfileId: filters.partnerId }),
    },
    include: {
      partnerProfile: {
        select: { StoreName: true, type: true },
      },
    },
  });
};

const updateStock = async (id, quantity) => {
  return await prisma.product.update({
    where: { id },
    data: { stockFull: quantity },
  });
};

export { createProduct, getProducts, getAllProducts, updateStock };
