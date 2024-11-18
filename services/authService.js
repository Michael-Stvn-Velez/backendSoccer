const User = require('../models/User');
const AppError = require('../utils/AppError'); 
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { sendConfirmationEmail, sendPasswordResetEmail } = require('./emailService');
const { generarContrasenaTemporal } = require('../utils/helpers');
const encryption = require('../utils/encryption');
const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken } = require('../utils/token');
const JWT_SECRET = process.env.JWT_SECRET; // Lee el secreto desde process.env


if (!JWT_SECRET) {
  throw new Error('Falta JWT_SECRET en las variables de entorno');
}

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

  await sendConfirmationEmail(email, names, confirmationCode); // Usa la función directamente

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

  // Actualiza el perfil del usuario
  const updatedUser = await User.findByIdAndUpdate(
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

  // Genera un token para el usuario actualizado
  const accessToken = generateAccessToken(updatedUser);

  // Devuelve el token y un mensaje de éxito
  return { accessToken, message: 'Perfil completado exitosamente' };
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

  // Genera el token incluyendo el ID del usuario, el email y los roles
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Guarda el refresh token en la base de datos
  user.refreshToken = refreshToken;
  await user.save();

  return { accessToken, refreshToken, name: `${user.names} ${user.firstSurname}` };
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

  await sendPasswordResetEmail(email, user.names, temporaryPassword); // Usa la función directamente

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

exports.resendUserConfirmationCode = async ({ email, names }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Usuario no encontrado');
  }
  
  const confirmationCode = Math.floor(100000 + Math.random() * 900000).toString();
  user.confirmationCode = confirmationCode;

  await user.save({ validateModifiedOnly: true });

  await sendConfirmationEmail(email, names, confirmationCode); // Usa la función correcta para enviar el código de confirmación

  return { message: 'Código de confirmación reenviado' };
};

exports.addRoleToSelf = async (userId, newRole) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("Usuario no encontrado", 404);
  }

  // Verifica que el rol aún no esté asignado
  if (!user.roles.includes(newRole)) {
    user.roles.push(newRole);
    await user.save({ validateModifiedOnly: true }); // Guardar solo los campos modificados y no validar todo
  } else {
    throw new AppError(`Ya tienes el rol ${newRole}`, 400);
  }

  return { message: `Rol ${newRole} agregado exitosamente a tu perfil` };
}; 

exports.refreshToken = async (refreshToken) => {
  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded) {
    throw new AppError('Refresh token inválido o expirado', 403);
  }

  const user = await User.findById(decoded.userId);
  if (!user || user.refreshToken !== refreshToken) {
    throw new AppError('Refresh token no válido', 403);
  }

  const newAccessToken = generateAccessToken(user);
  return { accessToken: newAccessToken };
};

// Función para cerrar sesión y revocar el refresh token
exports.logout = async (userId) => {
  const user = await User.findById(userId);
  if (user) {
    user.refreshToken = null;
    await user.save();
  }
  return { message: 'Sesión cerrada exitosamente' };
};