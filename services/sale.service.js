const Sale = require('../models/sale.model');
const SaleDetail = require('../models/saleDetail.model');
const Product = require('../models/product.model');
const { Sequelize } = require('sequelize');

const createSale = async ({ userId, productos }) => {
  Validation.userId({ userId });
  Validation.productos({ productos });

  return await Sale.sequelize.transaction(async (t) => {
    const venta = await Sale.create({ userId }, { transaction: t });

    for (const item of productos) {
      const producto = await Product.findByPk(item.productId, { transaction: t });
      if (!producto || producto.cantidad < item.cantidad) {
        throw new Error(`Stock insuficiente para el producto ID ${item.productId}`);
      }

      await producto.update(
        { cantidad: producto.cantidad - item.cantidad },
        { transaction: t }
      );

      await SaleDetail.create({
        saleId: venta.id,
        productId: item.productId,
        cantidad: item.cantidad,
        precioUnitario: producto.precio,
      }, { transaction: t });
    }

    return venta;
  });
};

const getAllSales = async () => {
  return await Sale.findAll({
    include: {
      model: SaleDetail,
    },
    order: [['createdAt', 'DESC']],
  });
};

class Validation {
  static userId(data) {
    if (!data.userId || typeof data.userId !== 'string') {
      throw new Error('El ID de usuario es obligatorio y debe ser una cadena.');
    }
  }

  static productos(data) {
    const { productos } = data;

    if (!Array.isArray(productos) || productos.length === 0) {
      throw new Error('Debe incluir al menos un producto en la venta.');
    }

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
    });
  }
}

module.exports = {
  createSale,
  getAllSales,
};
