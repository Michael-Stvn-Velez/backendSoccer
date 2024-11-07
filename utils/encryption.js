// utils/encryption.js
const bcrypt = require('bcryptjs');

/**
 * Cifra una contraseña
 * @param {string} password - Contraseña que se desea cifrar
 * @returns {Promise<string>} - Contraseña cifrada
 */
exports.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10); // Genera un salt con 10 rounds (ajustable)
  return await bcrypt.hash(password, salt);
};

/**
 * Compara una contraseña en texto plano con una contraseña cifrada
 * @param {string} password - Contraseña en texto plano
 * @param {string} hashedPassword - Contraseña cifrada almacenada
 * @returns {Promise<boolean>} - Resultado de la comparación (true si coinciden)
 */
exports.comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};