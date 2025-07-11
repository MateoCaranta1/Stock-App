const Purchase = require('../models/Purchase');
const PurchaseDetail = require('../models/purchaseDetail.model');
const Product = require('../models/product.model');

const createPurchase = async ({ userId, productos }) => {
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
    include: {
      model: PurchaseDetail,
    },
    order: [['createdAt', 'DESC']],
  });
};

module.exports = {
  createPurchase,
  getAllPurchases,
};
