const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { Comment } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateComment = [
  check('gameId').isInt(),
  check('body').isLength({ min: 1 }),
  handleValidationErrors
];

router.post('/', requireAuth, validateComment, async (req, res) => {
  const comment = await Comment.create({ ...req.body, userId: req.user.id });
  res.status(201).json({ comment });
});

router.put('/:id', requireAuth, validateComment, async (req, res, next) => {
  const comment = await Comment.findByPk(req.params.id);
  if (!comment) { const err = new Error('Comment not found'); err.status=404; return next(err); }
  if (comment.userId !== req.user.id) { const err = new Error('Forbidden'); err.status=403; return next(err); }
  await comment.update({ body: req.body.body, gameId: req.body.gameId });
  res.json({ comment });
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  const comment = await Comment.findByPk(req.params.id);
  if (!comment) { const err = new Error('Comment not found'); err.status=404; return next(err); }
  if (comment.userId !== req.user.id) { const err = new Error('Forbidden'); err.status=403; return next(err); }
  await comment.destroy();
  res.json({ message: 'Deleted' });
});

module.exports = router;
