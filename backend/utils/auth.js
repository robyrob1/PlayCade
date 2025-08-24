const jwt = require('jsonwebtoken');
const { User } = require('../db/models');
const secret = process.env.JWT_SECRET || 'dev_secret';
const expiresIn = parseInt(process.env.JWT_EXPIRES_IN || '604800'); // 7 days

const setTokenCookie = (res, user) => {
  const safeUser = { id: user.id, email: user.email, username: user.username };
  const token = jwt.sign({ data: safeUser }, secret, { expiresIn });
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('token', token, {
    maxAge: expiresIn * 1000,
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax' // for cross-site cookies on HTTPS
  });
  return token;
};

const restoreUser = (req, _res, next) => {
  const { token } = req.cookies || {};
  req.user = null;
  if (!token) return next();
  return jwt.verify(token, secret, null, async (err, payload) => {
    if (err) return next();
    try {
      const { id } = payload.data;
      const user = await User.findByPk(id);
      req.user = user || null;
    } catch {
      req.user = null;
    }
    return next();
  });
};

const requireAuth = (req, _res, next) => {
  if (!req.user) {
    const err = new Error('Authentication required');
    err.status = 401;
    return next(err);
  }
  return next();
};

module.exports = { setTokenCookie, restoreUser, requireAuth };
