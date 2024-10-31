const User = require('../models/User');
const AppError = require('../utils/AppError'); 
const emailService = require('../services/emailService');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { sendConfirmationEmail } = require('./emailService');
const { generarContrasenaTemporal } = require('../utils/helpers');
const generateToken = require('../utils/token');
const encryption = require('../utils/encryption');

// Registro de un nuevo usuario
exports.registerUser = async ({ names, email, password, firstSurname }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('El usuario ya existe');
  }

  const confirmationCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generación de un código de confirmación

  const user = new User({
    names,
    email,
    password,
    firstSurname,
    confirmationCode,
  });

  await user.save();

  await emailService.sendConfirmationEmail(email, names, confirmationCode); // Usa el servicio de email

  return { message: 'Registro inicial exitoso, revisa tu correo para confirmar tu cuenta' };
};

// Confirmación de cuenta mediante código de verificación
exports.confirmAccount = async ({ email, code }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  if (user.isVerified) {
    throw new Error('La cuenta ya está verificada');
  }

  if (user.confirmationCode !== code) {
    throw new Error('Código de confirmación incorrecto');
  }

  await User.findByIdAndUpdate(user._id, {
    isVerified: true,
    confirmationCode: null,
  });

  return { message: 'Cuenta verificada exitosamente' };
};

// Completar el perfil de usuario
exports.completeUserProfile = async ({ email, secondSurname, dateofBirth, role, numberIdentity, typeIdentity }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  if (!user.isVerified) {
    throw new Error('La cuenta no ha sido verificada');
  }

  await User.findByIdAndUpdate(
    user._id,
    {
      secondSurname,
      dateofBirth,
      role,
      numberIdentity,
      typeIdentity,
    },
    { new: true }
  );

  return { message: 'Perfil completado exitosamente' };
};

// Inicio de sesión de usuario
exports.loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  if (!user.isVerified) {
    throw new Error('Debes verificar tu cuenta antes de iniciar sesión');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Contraseña incorrecta', 400);
  }

  const token = generateToken(user._id);
  return { token, name: `${user.names} ${user.firstSurname}` };
};

// Restablecimiento de contraseña mediante una contraseña temporal
exports.resetUserPassword = async ({ email }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  const temporaryPassword = generarContrasenaTemporal();
  const hashedPassword = await encryption.encryptPassword(temporaryPassword);

  await User.findByIdAndUpdate(user._id, { password: hashedPassword });

  await emailService.sendPasswordResetEmail(email, user.names, temporaryPassword); // Usa el servicio de email

  return { message: 'Contraseña temporal enviada al correo' };
};

// Cambio de contraseña utilizando una contraseña temporal
exports.changeUserPassword = async ({ email, temporaryPassword, newPassword }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  const isMatch = await encryption.comparePassword(temporaryPassword, user.password);
  if (!isMatch) {
    throw new Error('La contraseña temporal es incorrecta');
  }

  const hashedPassword = await encryption.encryptPassword(newPassword);
  await User.findByIdAndUpdate(user._id, { password: hashedPassword });

  return { message: 'Contraseña cambiada exitosamente' };
};
