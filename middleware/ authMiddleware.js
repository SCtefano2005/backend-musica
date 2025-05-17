const { expressjwt: jwt } = require('express-jwt');
const { jwtSecret } = require('../config/config');

const authMiddleware = jwt({
  secret: jwtSecret,
  algorithms: ['HS256'],
  requestProperty: 'auth' // el token decodificado estará en req.auth
});

module.exports = authMiddleware;
