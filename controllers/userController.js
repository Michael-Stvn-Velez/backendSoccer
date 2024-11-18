const userService = require('../services/userService'); // Asegúrate de que la ruta es correcta
const AppError = require('../utils/AppError');

// Controlador para obtener la información del usuario autenticado
exports.getUserInfo = async (req, res, next) => {
  const userId = req.user?.userId; // Obtiene el userId desde el token

  if (!userId) {
    return res.status(400).json({ message: 'userId no encontrado en req.user' });
  }

  try {
    const user = await userService.getUserInfo(userId); // Llama a userService en lugar de authService
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
