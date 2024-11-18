const express = require('express');
const userController = require('../controllers/userController');
const { verifyToken } = require('../utils/token'); // Middleware para verificar token
const router = express.Router();

// Ruta para obtener la información del usuario autenticado
router.get('/me', verifyToken, userController.getUserInfo);

module.exports = router;
