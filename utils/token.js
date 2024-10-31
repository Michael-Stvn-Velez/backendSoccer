const jwt = require('jsonwebtoken');

const generateToken = (userId, expiresIn = '1h') => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn });
};

module.exports = generateToken;
