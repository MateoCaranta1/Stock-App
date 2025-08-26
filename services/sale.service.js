const { Sale } = require('../models');
const { SaleDetail } = require('../models');
const { Product } = require('../models');
const { User } = require('../models');
const sequelize = require('../config/db'); 
const { validate: isUUID } = require('uuid');

class Validation {
  static validateUserId(userId) {
    if (!userId || typeof userId !== 'string' || !isUUID(userId)) {
      throw new Error('El ID de usuario es obligatorio y debe ser válido.');
    }
  }

  static validateProductos(productos) {
    if (!Array.isArray(productos) || productos.length === 0) {
      throw new Error('Debe incluir al menos un producto en la venta.');
    }

    productos.forEach((item, index) => {
      if (
        item.productId === undefined ||
        item.productId === null ||
        typeof item.productId !== 'number'
      ) {
        throw new Error(`El ID del producto en la posición ${index + 1} es inválido.`);
      }

      if (
        typeof item.cantidad !== 'number' ||
        !Number.isInteger(item.cantidad) ||
        item.cantidad <= 0
      ) {
        throw new Error(
          `La cantidad del producto ID ${item.productId} debe ser un número entero mayor que 0.`
        );
      }

      if (
        item.precioUnitario !== undefined &&
        (typeof item.precioUnitario !== 'number' || item.precioUnitario < 0)
      ) {
        throw new Error(
          `El precio unitario del producto ID ${item.productId} debe ser un número mayor o igual a 0.`
        );
      }
    });
  }
}

const createSale = async ({ userId, productos }) => {
  Validation.validateUserId(userId);
  Validation.validateProductos(productos);

  const user = await User.findByPk(userId);
  if (!user) throw new Error(`Usuario con ID ${userId} no encontrado.`);

  return await sequelize.transaction(async (t) => {
    const venta = await Sale.create({ userId, fecha: new Date() }, { transaction: t });
    const avisos = [];

    for (const item of productos) {
      const producto = await Product.findByPk(item.productId, { transaction: t });
      if (!producto) throw new Error(`Producto con ID ${item.productId} no encontrado.`);
      if (producto.cantidad < item.cantidad) {
        throw new Error(
          `Stock insuficiente para el producto "${producto.nombre}" (ID ${item.productId}).`
        );
      }

      // Descontar stock
      const nuevaCantidad = producto.cantidad - item.cantidad;
      await producto.update({ cantidad: nuevaCantidad }, { transaction: t });

      if (nuevaCantidad <= producto.stockMinimo) {
        avisos.push(`⚠️ El producto "${producto.nombre}" alcanzó el stock mínimo (${nuevaCantidad} unidades).`);
      }

      // Guardar detalle de venta con el precio unitario que quieras
      await SaleDetail.create({
        saleId: venta.id,
        productId: producto.id,
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario || producto.precio, // ✅ precio de venta
      }, { transaction: t });
    }

    return { venta, avisos };
  });
};

const getAllSales = async (userId) => {
  return await Sale.findAll({
    where: { userId },
    include: [
      {
        model: SaleDetail,
        as: 'detalles',
        include: [
          {
            model: Product,
            as: 'productoVenta'
          }
        ]
      },
    ],
    order: [['createdAt', 'DESC']],
  });
};

module.exports = {
  createSale,
  getAllSales,
};
