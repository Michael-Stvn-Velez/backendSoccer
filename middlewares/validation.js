const { validationResult } = require('express-validator');

/**
 * Middleware que valida los resultados de las validaciones previas y envía una respuesta con los errores si existen.
 */
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Devuelve un error 400 con los detalles de los errores
    return res.status(400).json({
      status: 'error',
      statusCode: 400,
      errors: errors.array()
    });
  }
  next();
};
