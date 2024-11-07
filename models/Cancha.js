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
    ref: 'User', // Relación con el usuario propietario
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Cancha', CanchaSchema);
