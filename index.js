require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middleware para seguridad de cabeceras HTTP
app.use(helmet());

// Middleware para parsear JSON
app.use(express.json());

// Configuración de CORS
app.use(cors());

// Configuración de limitador de solicitudes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Límite de 100 solicitudes por IP
  message: 'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.',
});
app.use('/api/', limiter);

// Conexión a la base de datos MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// Rutas de la aplicación
app.use('/api/auth', authRoutes);

// Middleware de manejo de errores
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Integración del trabajo programado
const cron = require('node-cron');
const User = require('./models/User'); // Ajusta el path según tu estructura

// Programar el cron para que se ejecute cada 24 horas, a medianoche (00:00)
cron.schedule('0 0 * * *', async () => {
  console.log('Ejecutando trabajo programado diario para eliminar usuarios no confirmados...');

  // Definir la variable `oneDayAgo` correctamente
  const oneDayAgo = new Date(Date.now() - 86400 * 1000); // 24 horas atrás

  try {
    // Buscar usuarios no confirmados y creados hace más de 24 horas
    const users = await User.find({ isVerified: false, createdAt: { $lt: oneDayAgo } });
    console.log('Usuarios encontrados para eliminar:', users);

    // Eliminar los usuarios no confirmados encontrados
    const result = await User.deleteMany({ isVerified: false, createdAt: { $lt: oneDayAgo } });
    console.log(`Usuarios no confirmados eliminados: ${result.deletedCount}`);
  } catch (error) {
    console.error('Error eliminando usuarios no confirmados:', error);
  }
});
