const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { Review } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateReview = [
  check('gameId').isInt(),
  check('rating').isInt({ min:1, max:5 }),
  check('body').isLength({ min: 5 }),
  handleValidationErrors
];

router.post('/', requireAuth, validateReview, async (req, res, next) => {
  const exists = await Review.findOne({ where: { userId: req.user.id, gameId: req.body.gameId } });
  if (exists) { const err = new Error('You already reviewed this game'); err.status = 409; return next(err); }
  const review = await Review.create({ ...req.body, userId: req.user.id });
  res.status(201).json({ review });
});

router.put('/:id', requireAuth, validateReview, async (req, res, next) => {
  const review = await Review.findByPk(req.params.id);
  if (!review) { const err = new Error('Review not found'); err.status = 404; return next(err); }
  if (review.userId !== req.user.id) { const err = new Error('Forbidden'); err.status = 403; return next(err); }
  await review.update({ rating: req.body.rating, body: req.body.body, gameId: req.body.gameId });
  res.json({ review });
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  const review = await Review.findByPk(req.params.id);
  if (!review) { const err = new Error('Review not found'); err.status = 404; return next(err); }
  if (review.userId !== req.user.id) { const err = new Error('Forbidden'); err.status = 403; return next(err); }
  await review.destroy();
  res.json({ message: 'Deleted' });
});

module.exports = router;
