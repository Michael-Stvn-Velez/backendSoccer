class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode || 500;
      this.isOperational = true; // Flag para errores conocidos
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  module.exports = AppError;
  