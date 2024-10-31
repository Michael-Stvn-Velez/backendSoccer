const authService = require('../services/authService');
const User = require('../models/User');
const emailService = require('../services/emailService');

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
    res.status(200).json(result);
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

exports.resendConfirmationCode = async (req, res) => {
  try {
      const { email, names } = req.body;

      // Buscar usuario por email
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      // Generar un nuevo código de confirmación
      const confirmationCode = Math.floor(100000 + Math.random() * 900000).toString();
      user.confirmationCode = confirmationCode;

      // Guardar el usuario con el nuevo código
      await user.save({ validateModifiedOnly: true });

      // Llamar al servicio de email como en el registro
      await emailService.sendConfirmationEmail(email, names, confirmationCode);

      res.status(200).json({ message: 'Código de confirmación reenviado' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al reenviar el código de confirmación' });
  }
};