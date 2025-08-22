const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User } = require('../db/models');
const { secret, expiresIn } = jwtConfig;

const setTokenCookie = (res, user) => {
  const safeUser = { id: user.id, email: user.email, username: user.username };
  const token = jwt.sign({ data: safeUser }, secret, { expiresIn: parseInt(expiresIn) });
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('token', token, { maxAge: parseInt(expiresIn) * 1000, httpOnly: true, secure: isProduction, sameSite: isProduction && 'Lax' });
  return token;
};

const restoreUser = (req, res, next) => {
  const { token } = req.cookies;
  req.user = null;
  return jwt.verify(token, secret, null, async (err, payload) => {
    if (err) return next();
    try {
      const { id } = payload.data;
      req.user = await User.findByPk(id);
    } catch {
      res.clearCookie('token');
      return next();
    }
    if (!req.user) res.clearCookie('token');
    return next();
  });
};

const requireAuth = (req, _res, next) => {
  if (req.user) return next();
  const err = new Error('Unauthorized');
  err.title = 'Unauthorized';
  err.errors = { message: 'Authentication required' };
  err.status = 401;
  return next(err);
};

module.exports = { setTokenCookie, restoreUser, requireAuth };
