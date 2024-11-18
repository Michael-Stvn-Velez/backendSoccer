// userService.js

const User = require('../models/User');
const AppError = require('../utils/AppError');

// Función para obtener la información del usuario por ID
exports.getUserInfo = async (userId) => {
  const user = await User.findById(userId).select('-password -refreshToken');
  if (!user) {
    throw new AppError('Usuario no encontrado', 404);
  }
  return user;
};
