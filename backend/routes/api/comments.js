const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { Comment } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

router.get('/', async (req, res) => {
  const where = {}
  if (req.query.gameId) where.gameId = Number(req.query.gameId)
  const comments = await Comment.findAll({ where, order: [['createdAt','DESC']] })
  res.json({ comments })
});

router.get('/:id', async (req, res, next) => {
  const comment = await Comment.findByPk(req.params.id);
  if (!comment) { const err = new Error('Not found'); err.status=404; return next(err); }
  res.json({ comment });
});

router.post('/', requireAuth, [
  check('gameId').isInt({ min:1 }),
  check('body').isLength({ min:1 }),
  handleValidationErrors
], async (req, res) => {
  const { gameId, body } = req.body;
  const comment = await Comment.create({ gameId, body, userId: req.user.id });
  res.status(201).json({ comment });
});

router.put('/:id', requireAuth, [
  check('body').optional().isLength({ min:1 }),
  handleValidationErrors
], async (req, res, next) => {
  const comment = await Comment.findByPk(req.params.id);
  if (!comment) { const err = new Error('Not found'); err.status=404; return next(err); }
  if (comment.userId !== req.user.id) { const err = new Error('Forbidden'); err.status=403; return next(err); }
  await comment.update(req.body);
  res.json({ comment });
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  const comment = await Comment.findByPk(req.params.id);
  if (!comment) { const err = new Error('Not found'); err.status=404; return next(err); }
  if (comment.userId !== req.user.id) { const err = new Error('Forbidden'); err.status=403; return next(err); }
  await comment.destroy();
  res.json({ message: 'Deleted' });
});

module.exports = router;
