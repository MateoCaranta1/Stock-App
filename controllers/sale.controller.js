const saleService = require('../services/sale.service');

exports.create = async (req, res) => {
  try {
    const userId = req.user.id; // middleware JWT
    const { productos } = req.body;
    const { venta, avisos } = await saleService.createSale({ userId, productos });
res.status(201).json({
  venta,
  avisos,
});
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const ventas = await saleService.getAllSales();
    res.json(ventas);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener ventas' });
  }
};
