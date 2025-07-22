const Product = require('../models/product.model');

const getAllProducts = async () => {
  return await Product.findAll();
};

const getProductById = async (id) => {
  return await Product.findByPk(id);
};

const createProduct = async (data) => {
  Validation.validarTodo(data);

  const existingProduct = await Product.findOne({
    where: { nombre: data.nombre.trim() }
  });
  if (existingProduct) {
    throw new Error('Ya existe un producto con ese nombre');
  }

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
  static validarCamposCompletos(data) {
    const { nombre, categoria, precio, cantidad, stockMinimo } = data;

    if (
      !nombre ||
      !categoria ||
      precio == null ||
      cantidad == null ||
      stockMinimo == null
    ) {
      throw new Error('Por favor debe completar todos los campos');
    }
  }

  static nombre(data) {
    if (typeof data.nombre !== 'string' || data.nombre.trim().length < 2) {
      throw new Error('Nombre inválido');
    }
  }

  static precio(data) {
    if (typeof data.precio !== 'number' || data.precio < 0) {
      throw new Error('Precio inválido');
    }
  }

  static cantidad(data) {
    if (!Number.isInteger(data.cantidad) || data.cantidad < 0) {
      throw new Error('Cantidad inválida');
    }
  }

  static stock(data) {
    if (!Number.isInteger(data.stockMinimo) || data.stockMinimo < 0) {
      throw new Error('Stock mínimo inválido');
    }
  }

  static categoria(data) {
    if (typeof data.categoria !== 'string' || data.categoria.trim().length < 2) {
      throw new Error('Categoría inválida');
    }
  }

  static validarTodo(data) {
    this.validarCamposCompletos(data);
    this.nombre(data);
    this.categoria(data);
    this.precio(data);
    this.cantidad(data);
    this.stock(data);
  }
}


module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
