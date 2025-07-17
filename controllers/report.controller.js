const reportService = require('../services/report.service');

exports.lowStock = async (req, res) => {
  try {
    const productos = await reportService.getLowStockProducts();
    res.json(productos);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Error al obtener productos con poco stock' });
  }
};

exports.sales = async (req, res) => {
  try {
    const { from, to } = req.query;
    if (!from || !to) {
      return res.status(400).json({ error: 'Debe proporcionar los parámetros "from" y "to"' });
    }

    const ventas = await reportService.getSalesReport(from, to);
    res.json(ventas);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Error al obtener reporte de ventas' });
  }
};

exports.purchases = async (req, res) => {
  try {
    const { from, to } = req.query;
    if (!from || !to) {
      return res.status(400).json({ error: 'Debe proporcionar los parámetros "from" y "to"' });
    }

    const compras = await reportService.getPurchaseReport(from, to);
    res.json(compras);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Error al obtener reporte de compras' });
  }
};
