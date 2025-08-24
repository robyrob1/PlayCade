const express = require('express');
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { setTokenCookie } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const { User } = require('../../db/models');
const bcrypt = require('bcryptjs');

const router = express.Router();

const validateLogin = [
  check('credential').exists({ checkFalsy: true }).withMessage('Credential is required'),
  check('password').exists({ checkFalsy: true }).withMessage('Password is required'),
  handleValidationErrors
];

router.post('/', validateLogin, async (req, res, next) => {
  const { credential, password } = req.body;
  const user = await User.findOne({ where: { [Op.or]: [{ email: credential }, { username: credential }] } });
  if (!user) { const err = new Error('Invalid credentials'); err.status = 401; return next(err); }
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) { const err = new Error('Invalid credentials'); err.status = 401; return next(err); }
  const safeUser = { id: user.id, email: user.email, username: user.username };
  setTokenCookie(res, safeUser);
  return res.json({ user: safeUser });
});

router.delete('/', (_req, res) => {
  res.clearCookie('token', { sameSite: 'none', secure: process.env.NODE_ENV==='production' });
  return res.json({ message: 'success' });
});

router.get('/', (req, res) => {
  if (req.user) {
    const { id, email, username } = req.user;
    return res.json({ user: { id, email, username } });
  } else return res.json({ user: null });
});

module.exports = router;
