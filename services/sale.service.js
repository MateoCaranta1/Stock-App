const Sale = require('../models/sale.model');
const SaleDetail = require('../models/saleDetail.model');
const Product = require('../models/product.model');
const { Sequelize } = require('sequelize');

const createSale = async ({ userId, productos }) => {
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

module.exports = {
  createSale,
  getAllSales,
};
