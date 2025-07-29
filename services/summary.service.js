const { Op } = require("sequelize");
const { Product, Sale, SaleDetail, Purchase } = require("../models");

const summary = async () => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const sales = await Sale.findAll({
        where: {
            createdAt: { [Op.between]: [todayStart, todayEnd] },
        },
        include: [SaleDetail],
    });

    const compras = await Purchase.findAll({
        where: {
            createdAt: {
                [Op.between]: [todayStart, todayEnd],
            }
        }
    })

    const totalGanado = ventas.reduce((total, venta) => total + venta.total, 0);

    const totalPerdido = compras.reduce((total, compra) => total + compra.total, 0);

    const product = await Product.findAll();

    const stockLines = productos
        .map((p) => `• ${p.name}: ${p.stock} unidades`)
        .join('\n');

    return `
🧾 RESUMEN DIARIO

💰 Total ganado por ventas: $${totalGanado}
📉 Total gastado en compras: $${totalPerdido}

📦 Stock actual:
${stockLines}
`;
}

module.exports = { summary };