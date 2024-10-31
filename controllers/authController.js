const authService = require('../services/authService');


// Controlador para registrar un nuevo usuario
exports.registerInitial = async (req, res, next) => {
  try {
    const result = await authService.registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error); // Pasar el error al middleware de manejo de errores
  }
};

// Controlador para confirmar la cuenta de un usuario
exports.confirmAccount = async (req, res, next) => {
  try {
    const result = await authService.confirmAccount(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Controlador para completar el perfil de usuario
exports.completeProfile = async (req, res, next) => {
  try {
    const result = await authService.completeUserProfile(req.body);
    res.status(200).json(result); // Ahora result contiene { token, message }
  } catch (error) {
    next(error);
  }
};

// Controlador para el inicio de sesión
exports.login = async (req, res, next) => {
  try {
    const result = await authService.loginUser(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Controlador para restablecer la contraseña
exports.resetPassword = async (req, res, next) => {
  try {
    const result = await authService.resetUserPassword(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Controlador para cambiar la contraseña con una temporal
exports.changePassword = async (req, res, next) => {
  try {
    const result = await authService.changeUserPassword(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

exports.resendConfirmationCode = async (req, res, next) => {
  try {
      const result = await authService.resendUserConfirmationCode(req.body);
      res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};