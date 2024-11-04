const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { validate } = require('../middlewares/validation');

const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post('/register',
  [
    body('names')
      .trim()
      .escape()
      .notEmpty().withMessage('El nombre es obligatorio')
      .isLength({ max: 50 }).withMessage('El nombre debe tener como máximo 50 caracteres'),
    body('email')
      .isEmail().withMessage('Debe ser un correo electrónico válido')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
      .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/).withMessage('La contraseña debe incluir al menos una letra y un número')
  ],
  validate, // Middleware de validación reutilizable
  authController.registerInitial
);

// Ruta para completar el perfil de usuario
router.post('/register-complete',
  [
    body('email').isEmail().withMessage('Debe ser un correo electrónico válido').normalizeEmail(),
    body('secondSurname')
      .optional()
      .trim()
      .escape()
      .isLength({ max: 50 }).withMessage('El segundo apellido debe tener como máximo 50 caracteres'),
    body('dateofBirth')
      .optional()
      .isISO8601().withMessage('Debe ser una fecha válida en formato ISO'),
    body('role')
      .optional()
      .isIn(['player', 'owner', 'referee', 'school', 'admin']).withMessage('El rol debe ser válido'),
    body('numberIdentity')
      .optional()
      .isLength({ max: 30 }).withMessage('El número de identidad debe tener como máximo 30 caracteres'),
    body('typeIdentity')
      .optional()
      .isIn(['CC', 'TI', 'TE', 'RC']).withMessage('El tipo de identidad debe ser uno de CC, TI, TE, RC')
  ],
  validate,
  authController.completeProfile
);

// Ruta para iniciar sesión
router.post('/login',
  [
    body('email').isEmail().withMessage('Debe ser un correo electrónico válido').normalizeEmail(),
    body('password').trim().escape().notEmpty().withMessage('La contraseña es obligatoria')
  ],
  validate,
  authController.login
);

// Ruta para restablecer la contraseña
router.post('/reset-password',
  [
    body('email').isEmail().withMessage('Debe ser un correo electrónico válido').normalizeEmail()
  ],
  validate,
  authController.resetPassword
);

// Ruta para cambiar la contraseña con una temporal
router.post('/change-password',
  [
    body('email').isEmail().withMessage('Debe ser un correo electrónico válido').normalizeEmail(),
    body('temporaryPassword').trim().escape().notEmpty().withMessage('La contraseña temporal es obligatoria'),
    body('newPassword')
      .isLength({ min: 8 }).withMessage('La nueva contraseña debe tener al menos 8 caracteres')
      .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/).withMessage('La nueva contraseña debe incluir al menos una letra y un número')
  ],
  validate,
  authController.changePassword
);

// Ruta para confirmar la cuenta del usuario
router.post('/confirm-account',
  [
    body('email').isEmail().withMessage('Debe ser un correo electrónico válido').normalizeEmail(),
    body('code').trim().escape().notEmpty().withMessage('El código de confirmación es obligatorio')
  ],
  validate,
  authController.confirmAccount
);

// Ruta para reenviar el código de confirmación
router.post('/resend-confirmation-code',
  [
    body('email').isEmail().withMessage('Debe ser un correo electrónico válido').normalizeEmail()
  ],
  validate,
  authController.resendConfirmationCode
);

module.exports = router;
