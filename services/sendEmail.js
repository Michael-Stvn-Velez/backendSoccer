// emailService.js o sendEmail.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendConfirmationEmail = async (email, names, confirmationCode) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Código de Confirmación',
            html: `<p>Hola ${names},</p><p>Tu código de confirmación es: <strong>${confirmationCode}</strong></p>`,
        };
        
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error enviando el correo:", error);
        throw error;
    }
};

module.exports = { sendConfirmationEmail };
