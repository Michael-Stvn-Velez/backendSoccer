const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET; // Asegúrate de tener JWT_SECRET en tus variables de entorno

// Función para generar un token con roles
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      roles: user.roles || [], // Asegura que `roles` esté presente, aunque sea un array vacío
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
  
};

// Middleware para verificar el token y cargar el usuario en req.user
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    // Verificar el token y decodificar el payload
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Asigna el payload decodificado a `req.user`
    console.log('req.user en verifyToken:', req.user); // Verifica el contenido después de asignarlo
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
