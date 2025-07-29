const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

const sendMail = async (subject, text) => {
    await transporter.sendMail({
        from: `"Control Stock" <${process.env.MAIL_USER}>`,
        to: 'tucorreo@ejemplo.com',
    subject,
    text,
  });
};

module.exports = { sendMail };