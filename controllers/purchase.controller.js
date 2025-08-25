const purchaseService = require('../services/purchase.service');

exports.create = async (req, res) => {
  try {
    const userId = req.userId; 

    const { productos } = req.body;
    const compra = await purchaseService.createPurchase({ userId, productos });

    res.status(201).json(compra);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const compras = await purchaseService.getAllPurchases(req.userId);
    res.json(compras);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener compras' });
  }
};