const mongoose = require('mongoose');

const CanchaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxLength: 100,
  },
  location: {
    type: String,
    required: true,
    maxLength: 200,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  numeroContacto: {
    type: String,
    maxLength: 30,
    required: false,
  },
  rutaGoogleMaps: {
    type: String,
    required: false,
  },
  foto: {
    type: String, 
    required: false,
  },
  tipo: {
    type: String,
    enum: ['cesped', 'cesped sintetico', 'arena'], 
    required: false,
  },
  capacidad: {
    type: String,
    enum: ['futbol 5', 'futbol 6', 'futbol 7', 'futbol 8', 'futbol 9', 'futbol 10', 'futbol 11'], 
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Cancha', CanchaSchema);
