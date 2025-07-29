const { summary } = require("../services/summary.service");
const { sendMail } = require("../utils/mailer");

const runDailyJob = async () => {
   const resumen = await summary();
   await sendMail('Resumen diario de stock', resumen);
}

runDailyJob();