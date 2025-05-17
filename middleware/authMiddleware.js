const { expressjwt: jwt } = require('express-jwt');
const { jwtSecret } = require('../config/db');

const authMiddleware = jwt({
  secret: jwtSecret,
  algorithms: ['HS256'],
  requestProperty: 'auth'
});

module.exports = authMiddleware;
