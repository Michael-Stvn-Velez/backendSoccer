const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET; // Secreto para el access token
const REFRESH_SECRET = process.env.REFRESH_SECRET; // Secreto separado para el refresh token

// Función para generar un access token
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      roles: user.roles || [], // Asegura que `roles` esté presente, aunque sea un array vacío
    },
    JWT_SECRET,
    { expiresIn: '15m' } // Access token de corta duración
  );
};

// Función para generar un refresh token
const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
    },
    REFRESH_SECRET,
    { expiresIn: '7d' } // Refresh token de larga duración
  );
};

// Middleware para verificar el access token y cargar el usuario en req.user
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    // Verificar el access token y decodificar el payload
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Asigna el payload decodificado a `req.user`
    console.log('req.user en verifyToken:', req.user); // Verifica el contenido después de asignarlo
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

// Función para verificar el refresh token
const verifyRefreshToken = (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
};
