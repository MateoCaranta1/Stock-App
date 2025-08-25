const Purchase = require('../models/purchase.model');
const PurchaseDetail = require('../models/purchaseDetail.model');
const Product = require('../models/product.model');
const { User } = require('../models');
const { validate: isUUID } = require('uuid');

class Validation {
  static validateUserId(userId) {
    if (
      userId === undefined ||
      userId === null ||
      typeof userId === 'number' ||
      `${userId}`.trim() === '' ||
      !isUUID(userId)
    ) {
      throw new Error('El ID de usuario es obligatorio y debe ser válido.');
    }
  }

  static productos(productos) {
    if (!Array.isArray(productos) || productos.length === 0)
      throw new Error('Debe haber al menos un producto en la compra.');
  
    productos.forEach((item, index) => {
      // Si no hay productId, debe tener nombre
      if (!item.productId) {
        if (!item.nombre || typeof item.nombre !== 'string') {
          throw new Error(`El producto en la posición ${index + 1} debe tener un nombre.`);
        }
      } else {
        if (typeof item.productId !== 'number') {
          throw new Error(`El ID del producto en la posición ${index + 1} es inválido.`);
        }
      }
  
      if (
        typeof item.cantidad !== 'number' ||
        !Number.isInteger(item.cantidad) ||
        item.cantidad <= 0
      ) {
        throw new Error(`La cantidad del producto en la posición ${index + 1} debe ser un número entero mayor que 0.`);
      }
  
      if (
        item.precioUnitario !== undefined &&
        (typeof item.precioUnitario !== 'number' || item.precioUnitario < 0)
      ) {
        throw new Error(`El precio unitario del producto en la posición ${index + 1} debe ser un número mayor o igual a 0.`);
      }
    });
  }
  
};

const createPurchase = async ({ userId, productos }) => {
  Validation.validateUserId(userId);
  Validation.productos(productos);

  const user = await User.findByPk(userId);
  if (!user) throw new Error(`Usuario con ID ${userId} no encontrado.`);

  return await Purchase.sequelize.transaction(async (t) => {
    const compra = await Purchase.create({ userId }, { transaction: t });

    for (const item of productos) {
      let producto;

      if (item.productId) {
        // Producto existente por ID
        producto = await Product.findByPk(item.productId, { transaction: t });
        if (!producto) throw new Error(`Producto ID ${item.productId} no encontrado.`);
        // Actualizar stock
        await producto.update(
          { cantidad: producto.cantidad + item.cantidad },
          { transaction: t }
        );
      } else {
        // Producto nuevo: buscar por nombre para evitar duplicados
        producto = await Product.findOne({ where: { nombre: item.nombre }, transaction: t });
        if (producto) {
          // Si ya existe por nombre, solo actualizar stock
          await producto.update(
            { cantidad: producto.cantidad + item.cantidad },
            { transaction: t }
          );
        } else {
          // Si no existe, crear nuevo producto
          producto = await Product.create({
            nombre: item.nombre,
            categoria: item.categoria || null,
            precio: item.precioUnitario || 0,
            cantidad: item.cantidad,
            stockMinimo: item.stockMinimo || 5,
          }, { transaction: t });
        }
      }

      // Crear detalle de la compra
      await PurchaseDetail.create({
        purchaseId: compra.id,
        productId: producto.id,
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario || producto.precio,
      }, { transaction: t });
    }

    return compra;
  });
};


const getAllPurchases = async (userId) => {
  return await Purchase.findAll({
    where: { userId },
    include: {
      model: PurchaseDetail,
      as: 'detalles',
      include: ['productoCompra'],
    },
    order: [['createdAt', 'DESC']],
  });
};

module.exports = {
  createPurchase,
  getAllPurchases,
  Validation,
};
