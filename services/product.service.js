const Product = require('../models/product.model');

const getAllProducts = async () => {
  return await Product.findAll();
};

const getProductById = async (id) => {
  return await Product.findByPk(id);
};

const createProduct = async (data) => {
  Validation.nombre(data);
  Validation.precio(data);
  Validation.cantidad(data);
  Validation.stock(data);

  return await Product.create(data);
};

const updateProduct = async (id, data) => {
  Validation.nombre(data);
  Validation.precio(data);
  Validation.cantidad(data);
  Validation.stock(data);

  const product = await Product.findByPk(id);
  if (!product) return null;
  return await product.update(data);
};

const deleteProduct = async (id) => {
  const product = await Product.findByPk(id);
  if (!product) return null;
  await product.destroy();
  return true;
};

class Validation {
  static nombre(data) {
    if (!data.nombre || typeof data.nombre !== 'string' || data.nombre.length < 2)
      throw new Error('Nombre inválido.');
  };

  static precio(data) {
    if (!typeof data.precio !== 'number' || data.precio < 0)
      throw new Error('Precio inválido.');
  };

  static cantidad(data) {
    if (!Number.isInteger(data.cantidad) || data.cantidad < 0)
      throw new Error('Cantidad inválida.');
  };

  static stock(data) {
    if ('stockMinimo' in data && (!Number.isInteger(data.stockMinimo) || data.stockMinimo < 0))
      throw new Error('Stock mínimo inválido.');
  };
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
