const { validationResult } = require('express-validator');
const authService = require('../services/authService');
const AppError = require('../utils/AppError');
const { generateAccessToken, verifyRefreshToken } = require('../utils/token');
const User = require('../models/User');

// Función auxiliar para manejar errores de validación
const handleValidationErrors = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Errores de validación', 400, errors.array());
  }
};

// Controlador para registrar un nuevo usuario
exports.registerInitial = async (req, res, next) => {
  try {
    handleValidationErrors(req);
    const result = await authService.registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

// Controlador para confirmar la cuenta de un usuario
exports.confirmAccount = async (req, res, next) => {
  try {
    handleValidationErrors(req);
    const result = await authService.confirmAccount(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Controlador para completar el perfil de usuario
exports.completeProfile = async (req, res, next) => {
  try {
    handleValidationErrors(req);
    const result = await authService.completeUserProfile(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Controlador para el inicio de sesión
exports.login = async (req, res, next) => {
  try {
    handleValidationErrors(req);
    const result = await authService.loginUser(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Controlador para restablecer la contraseña
exports.resetPassword = async (req, res, next) => {
  try {
    handleValidationErrors(req);
    const result = await authService.resetUserPassword(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Controlador para cambiar la contraseña con una temporal
exports.changePassword = async (req, res, next) => {
  try {
    handleValidationErrors(req);
    const result = await authService.changeUserPassword(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Controlador para reenviar el código de confirmación
exports.resendConfirmationCode = async (req, res, next) => {
  try {
    handleValidationErrors(req);
    const result = await authService.resendUserConfirmationCode(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Controlador para agregar un rol al usuario autenticado
exports.addRoleToSelf = async (req, res, next) => {
  console.log('req.user en addRoleToSelf:', req.user);
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(400).json({ message: 'userId no encontrado en req.user' });
  }

  const { role } = req.body;

  try {
    const result = await authService.addRoleToSelf(userId, role);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Controlador para renovar el token de acceso
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new AppError('Refresh token no proporcionado', 401);

    const result = await authService.refreshToken(refreshToken);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Controlador para cerrar sesión y revocar el refresh token
exports.logout = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const result = await authService.logout(userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};