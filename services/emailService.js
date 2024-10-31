// services/emailService.js
const nodemailer = require('nodemailer');

// Configuración del transportador de nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Cambia esto según el servicio de correo que uses
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Envía un correo de confirmación de cuenta al usuario
 * @param {string} email - Dirección de correo del usuario
 * @param {string} names - Nombre del usuario
 * @param {string} confirmationCode - Código de confirmación
 */
const sendConfirmationEmail = async (email, names, confirmationCode) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Código de Confirmación de Cuenta',
    html: `<p>Hola ${names},</p>
           <p>Gracias por registrarte. Tu código de confirmación es: <strong>${confirmationCode}</strong></p>
           <p>Por favor, ingrésalo en la aplicación para verificar tu cuenta.</p>`,
  };

  await transporter.sendMail(mailOptions);
};

/**
 * Envía un correo de restablecimiento de contraseña con una contraseña temporal
 * @param {string} email - Dirección de correo del usuario
 * @param {string} names - Nombre del usuario
 * @param {string} temporaryPassword - Contraseña temporal generada
 */
const sendPasswordResetEmail = async (email, names, temporaryPassword) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Cambio de Contraseña',
    html: `<p>Hola ${names},</p>
           <p>Tu nueva contraseña temporal es: <strong>${temporaryPassword}</strong></p>
           <p>Por favor, cámbiala una vez ingreses en la aplicación.</p>
           <p>Saludos,</p>
           <p>Equipo de Soporte</p>`,
  };

  await transporter.sendMail(mailOptions);
};

// Exporta ambas funciones en un solo módulo
module.exports = { sendConfirmationEmail, sendPasswordResetEmail };
