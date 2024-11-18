const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  names: {
    type: String,
    required: false,
    maxLength: 50,
  },
  firstSurname: {
    type: String,
    required: false,
    maxLength: 50,
  },
  secondSurname: {
    type: String,
    required: false,
    maxLength: 50,
  },
  dateofBirth: {
    type: Date,
    required: false,
    validate: {
      validator: function (v) {
        return !isNaN(Date.parse(v)); // Verifica si es una fecha válida
      },
      message: props => `${props.value} no es una fecha válida.`
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
      },
      message: props => `${props.value} no es un correo electrónico válido.`
    }
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    type: [String], 
    enum: ['player', 'owner', 'referee', 'school', 'admin'],
    default: ['player'],
  },
  numberIdentity: {
    type: String,
    required: false,
    maxLength: 30,
  },
  typeIdentity: {
    type: String,
    enum: ['CC', 'TI', 'TE', 'RC'],
    required: false
  },
  confirmationCode: {
    type: String,
    default: null
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  }
}, { timestamps: true });

// Middleware para cifrar la contraseña y validar el formato antes de guardarla
UserSchema.pre('save', async function (next) {
  const user = this;
  
  // Solo valida el formato si la contraseña es nueva o ha sido modificada
  if (user.isModified('password')) {
    const passwordFormat = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordFormat.test(user.password)) {
      const error = new Error('La contraseña debe tener al menos 8 caracteres, incluyendo una letra y un número.');
      return next(error);
    }
    
    // Encripta la contraseña
    user.password = await bcrypt.hash(user.password, 10);
  }

  next();
});

// Método para verificar la contraseña en el modelo de usuario
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
