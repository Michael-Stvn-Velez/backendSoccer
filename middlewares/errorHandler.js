const AppError = require('../utils/AppError');

const errorHandler = (err, req, res, next) => {
  // Si es una instancia de AppError, usamos el código de estado especificado, de lo contrario, 500 (Internal Server Error)
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error en el servidor';

  // Log de errores para propósitos de desarrollo
  console.error('Error:', err);

  // Enviar respuesta de error al cliente
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
  });
};

module.exports = errorHandler;