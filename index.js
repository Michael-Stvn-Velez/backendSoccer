require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cron = require('node-cron');
const errorHandler = require('./middlewares/errorHandler');
const User = require('./models/User');

// Importar las rutas de autenticación y gestión de canchas
const authRoutes = require('./routes/auth');
const canchas = require('./routes/canchas');

const app = express();

// Middleware de seguridad de cabeceras HTTP
app.use(helmet());

// Middleware para analizar JSON
app.use(express.json());

// Configuración de CORS
app.use(cors());

// Configuración del limitador de solicitudes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Límite de 100 solicitudes por IP
  message: 'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.',
});
app.use('/api/', limiter);

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// Rutas de autenticación (sin `verifyToken` para permitir inicio de sesión y registro)
app.use('/api/auth', authRoutes);
app.use('/api/canchas', canchas);

// Middleware de manejo de errores
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Tarea programada: Eliminar usuarios no confirmados
cron.schedule('0 0 * * *', async () => {
  console.log('Ejecutando trabajo programado diario para eliminar usuarios no confirmados...');
  
  const oneDayAgo = new Date(Date.now() - 86400 * 1000); // 24 horas atrás
  
  try {
    const users = await User.find({ isVerified: false, createdAt: { $lt: oneDayAgo } });
    console.log('Usuarios encontrados para eliminar:', users);
    
    const result = await User.deleteMany({ isVerified: false, createdAt: { $lt: oneDayAgo } });
    console.log(`Usuarios no confirmados eliminados: ${result.deletedCount}`);
  } catch (error) {
    console.error('Error eliminando usuarios no confirmados:', error);
  }
});
