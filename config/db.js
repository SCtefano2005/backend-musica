require('dotenv').config();
module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'tu_secreto_super_seguro'
};
