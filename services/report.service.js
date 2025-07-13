const Product = require('../models/product.model');
const Sale = require('../models/sale.model');
const Purchase = require('../models/purchase.model');
const { Op } = require('sequelize');

const getLowStockProducts = async () => {
  return await Product.findAll({
    where: {
      cantidad: { [Op.lt]: Sequelize.col('stockMinimo') },
    },
    order: [['cantidad', 'ASC']],
  });
};

const getSalesReport = async (startDate, endDate) => {
  return await Sale.findAll({
    where: {
      createdAt: {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      },
    },
    include: ['SaleDetails'],
    order: [['createdAt', 'DESC']],
  });
};

const getPurchaseReport = async (startDate, endDate) => {
  return await Purchase.findAll({
    where: {
      createdAt: {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      },
    },
    include: ['PurchaseDetails'],
    order: [['createdAt', 'DESC']],
  });
};

module.exports = {
  getLowStockProducts,
  getSalesReport,
  getPurchaseReport,
};
