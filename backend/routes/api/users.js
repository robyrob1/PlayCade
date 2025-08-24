const express = require('express');
const { check } = require('express-validator');
const { setTokenCookie } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const { User, Game } = require('../../db/models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const router = express.Router();

const validateSignup = [
  check('email').exists({ checkFalsy: true }).isEmail().withMessage('Please provide a valid email.'),
  check('username').exists({ checkFalsy: true }).isLength({ min: 3 }).withMessage('Please provide a username with at least 3 characters.'),
  check('username').not().isEmail().withMessage('Username cannot be an email.'),
  check('password').exists({ checkFalsy: true }).isLength({ min: 6 }).withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

router.post('/', validateSignup, async (req, res, next) => {
  const { email, username, password } = req.body;
  const existing = await User.unscoped().findOne({ where: { [Op.or]: [{ email }, { username }] } });
  if (existing) {
    const err = new Error('User already exists');
    err.status = 403;
    err.errors = { email: 'User with that email or username already exists' };
    return next(err);
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, username, passwordHash });
  const safeUser = { id: user.id, email: user.email, username: user.username };
  setTokenCookie(res, safeUser);
  return res.json({ user: safeUser });
});

router.get('/:id', async (req, res, next) => {
  const user = await User.findByPk(req.params.id);
  if (!user) { const err = new Error('User not found'); err.status = 404; return next(err); }
  const recentGames = await Game.findAll({ where: { authorUserId: user.id }, order: [['createdAt','DESC']], limit: 8 });
  return res.json({ id: user.id, username: user.username, email: user.email, recentGames });
});

module.exports = router;
