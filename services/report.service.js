const { Product } = require('../models');
const { Sale } = require('../models');
const { Purchase  } = require('../models');
const { Op, Sequelize } = require('sequelize');

const getLowStockProducts = async () => {
  return await Product.findAll({
    where: {
      cantidad: { [Op.lt]: Sequelize.col('stockMinimo') },
    },
    order: [['cantidad', 'ASC']],
  });
};

const getSalesReport = async (startDate, endDate) => {
  if (!startDate || !endDate) throw new Error('Debe proporcionar fecha de inicio y fin');

  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999); // Incluye todo el día

  return await Sale.findAll({
    where: {
      createdAt: {
        [Op.between]: [start, end],
      },
    },
    include: ['detalles'],
    order: [['createdAt', 'DESC']],
  });
};

const getPurchaseReport = async (startDate, endDate) => {
  if (!startDate || !endDate) throw new Error('Debe proporcionar fecha de inicio y fin');

  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999); // Incluye todo el día

  return await Purchase.findAll({
    where: {
      createdAt: {
        [Op.between]: [start, end],
      },
    },
    include: ['detalles'],
    order: [['createdAt', 'DESC']],
  });
};
module.exports = {
  getLowStockProducts,
  getSalesReport,
  getPurchaseReport,
};
