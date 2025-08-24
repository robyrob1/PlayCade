const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { Review } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

router.get('/', async (_req, res) => {
  const reviews = await Review.findAll({ order: [['createdAt','DESC']] });
  res.json({ reviews });
});

router.get('/:id', async (req, res, next) => {
  const review = await Review.findByPk(req.params.id);
  if (!review) { const err = new Error('Not found'); err.status=404; return next(err); }
  res.json({ review });
});

router.post('/', requireAuth, [
  check('gameId').isInt({ min:1 }),
  check('rating').isInt({ min:1, max:5 }),
  check('comment').isLength({ min:1 }),
  handleValidationErrors
], async (req, res) => {
  const { gameId, rating, comment } = req.body;
  const review = await Review.create({ gameId, rating, comment, userId: req.user.id });
  res.status(201).json({ review });
});

router.put('/:id', requireAuth, [
  check('rating').optional().isInt({ min:1, max:5 }),
  check('comment').optional().isLength({ min:1 }),
  handleValidationErrors
], async (req, res, next) => {
  const review = await Review.findByPk(req.params.id);
  if (!review) { const err = new Error('Not found'); err.status=404; return next(err); }
  if (review.userId !== req.user.id) { const err = new Error('Forbidden'); err.status=403; return next(err); }
  await review.update(req.body);
  res.json({ review });
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  const review = await Review.findByPk(req.params.id);
  if (!review) { const err = new Error('Not found'); err.status=404; return next(err); }
  if (review.userId !== req.user.id) { const err = new Error('Forbidden'); err.status=403; return next(err); }
  await review.destroy();
  res.json({ message: 'Deleted' });
});

module.exports = router;
