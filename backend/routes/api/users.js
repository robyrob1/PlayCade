const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { setTokenCookie } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const { User } = require('../../db/models');

const router = express.Router();

const validateSignup = [
  check('email').exists({ checkFalsy: true }).isEmail(),
  check('username').exists({ checkFalsy: true }).isLength({ min: 4 }),
  check('username').not().isEmail(),
  check('password').exists({ checkFalsy: true }).isLength({ min: 6 }),
  handleValidationErrors
];

router.post('/', validateSignup, async (req, res, next) => {
  const { email, password, username } = req.body;
  const existing = await User.unscoped().findOne({ where: { [User.sequelize.Op.or]: [{email},{username}] } });
  if (existing) { const err = new Error('User already exists'); err.status = 403; err.title = 'User already exists'; err.errors = { email: 'User with that email or username already exists' }; return next(err); }
  const hashedPassword = bcrypt.hashSync(password);
  const user = await User.create({ email, username, hashedPassword });
  const safeUser = { id: user.id, email: user.email, username: user.username };
  await setTokenCookie(res, safeUser);
  return res.json({ user: safeUser });
});

module.exports = router;
