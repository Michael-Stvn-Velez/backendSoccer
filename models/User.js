const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  names: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/.test(v); // Permitir letras con tildes, espacios, apóstrofes y guiones
      },
      message: props => `${props.value} no es un nombre válido. Solo puede contener letras, espacios, apóstrofes, guiones y tildes.`
    }
  },
  firstSurname: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/.test(v); // Permitir letras con tildes, espacios, apóstrofes y guiones
      },
      message: props => `${props.value} no es un apellido válido. Solo puede contener letras, espacios, apóstrofes, guiones y tildes.`
    }
  },
  secondSurname: {
    type: String,
    required: false,
    validate: {
      validator: function (v) {
        return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]*$/.test(v); // Permitir letras con tildes, espacios, apóstrofes y guiones (puede ser vacío)
      },
      message: props => `${props.value} no es un apellido válido. Solo puede contener letras, espacios, apóstrofes, guiones y tildes.`
    }
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
    validate: {
      validator: function (v) {
        return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(v); // Al menos 8 caracteres, una letra y un número
      },
      message: 'La contraseña debe tener al menos 8 caracteres, incluyendo una letra y un número.'
    }
  },
  role: {
    type: String,
    enum: ['player', 'owner', 'referee', 'school', 'admin'],
    default: 'player'
  },
  numberIdentity: {
    type: String,
    required: false,
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
    default: Date.now
  }
});

// Middleware para cifrar la contraseña antes de guardarla
UserSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

// Método para verificar la contraseña en el modelo de usuario
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
