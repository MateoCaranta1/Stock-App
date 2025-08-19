const productService = require('../services/product.service');

exports.getAll = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

exports.getById = async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const product = await productService.getProductById(id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener producto' });
  }
};

exports.create = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    if (err.message) {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Error al crear producto' });
  }
};

exports.update = async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const updated = await productService.updateProduct(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Producto no encontrado' });

    res.json(updated);
  } catch (err) {
    if (err.message.includes('inválido')) {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
};

exports.delete = async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const deleted = await productService.deleteProduct(id);
    if (!deleted) return res.status(404).json({ error: 'Producto no encontrado' });
    res.status(200).json({ message: 'Producto eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
};
