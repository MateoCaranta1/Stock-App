const Purchase = require('../models/purchase.model');
const PurchaseDetail = require('../models/purchaseDetail.model');
const Product = require('../models/product.model');
const { User } = require('../models');

const createPurchase = async ({ userId, productos }) => {
  Validation.userId(userId);
  Validation.productos(productos);

  const user = await User.findByPk(userId);
  if (!user) throw new Error(`Usuario con ID ${userId} no encontrado.`);

  return await Purchase.sequelize.transaction(async (t) => {
    const compra = await Purchase.create({ userId }, { transaction: t });

    for (const item of productos) {
      const producto = await Product.findByPk(item.productId, { transaction: t });
      if (!producto) throw new Error(`Producto ID ${item.productId} no encontrado.`);

      await producto.update(
        { cantidad: producto.cantidad + item.cantidad },
        { transaction: t }
      );

      await PurchaseDetail.create({
        purchaseId: compra.id,
        productId: item.productId,
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario || producto.precio,
      }, { transaction: t });
    }

    return compra;
  });
};

const getAllPurchases = async () => {
  return await Purchase.findAll({
    include: PurchaseDetail,
    order: [['createdAt', 'DESC']],
  });
};

class Validation {
  static userId(userId) {
    if (!userId || typeof userId !== 'number') {
      throw new Error('El ID de usuario es obligatorio y debe ser un número.');
    }
  }

  static productos(productos) {
    if (!Array.isArray(productos) || productos.length === 0)
      throw new Error('Debe haber al menos un producto en la compra.');

    productos.forEach((item, index) => {
      if (!item.productId || typeof item.productId !== 'number') {
        throw new Error(`El ID del producto en la posición ${index} es inválido.`);
      }

      if (
        typeof item.cantidad !== 'number' ||
        !Number.isInteger(item.cantidad) ||
        item.cantidad <= 0
      ) {
        throw new Error(`La cantidad del producto ID ${item.productId} debe ser un número entero mayor que 0.`);
      }

      if (
        item.precioUnitario !== undefined &&
        (typeof item.precioUnitario !== 'number' || item.precioUnitario < 0)
      ) {
        throw new Error(`El precio unitario del producto ID ${item.productId} debe ser un número mayor o igual a 0.`);
      }
    });
  }
}

module.exports = {
  createPurchase,
  getAllPurchases,
};