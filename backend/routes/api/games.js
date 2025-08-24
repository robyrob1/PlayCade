const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { Game, Review, Comment, User, Tag, GameTag, Sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');

const router = express.Router();

// Validators
const validateGameCreate = [
  check('title').exists({ checkFalsy: true }).isLength({ min: 2 }),
  check('description').exists({ checkFalsy: true }),
  check('playUrl').exists({ checkFalsy: true }).isURL(),
  handleValidationErrors
];

const validateGameUpdate = [
  check('title').optional().isLength({ min: 2 }),
  check('description').optional().isLength({ min: 1 }),
  check('playUrl').optional().isURL(),
  handleValidationErrors
];

function toSlug(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function attachTags(game, tags) {
  if (!Array.isArray(tags)) return;
  const tagRecords = [];
  for (const name of tags) {
    const slug = toSlug(String(name));
    const [t] = await Tag.findOrCreate({ where: { slug }, defaults: { name: String(name), slug } });
    tagRecords.push(t);
  }
  await GameTag.destroy({ where: { gameId: game.id } });
  for (const t of tagRecords) {
    await GameTag.findOrCreate({ where: { gameId: game.id, tagId: t.id }, defaults: { gameId: game.id, tagId: t.id } });
  }
}

async function serializeGame(game) {
  const g = game.toJSON();
  const tags = await game.getTags();
  const reviews = await Review.findAll({ where: { gameId: game.id }, include: [{ model: User, attributes: ['id','username'] }], order: [['createdAt','DESC']] });
  return {
    id: g.id,
    title: g.title,
    description: g.description,
    playUrl: g.playUrl,
    thumbnailUrl: g.thumbnailUrl,
    authorUserId: g.authorUserId,
    tags: tags.map(t => t.name),
    reviews: reviews.map(r => ({ id: r.id, rating: r.rating, comment: r.comment, userId: r.User.id, username: r.User.username }))
  };
}

// GET /api/games?tag=... or ?mine=true
router.get('/', async (req, res, next) => {
  const { tag, mine } = req.query;
  let where = {};
  if (mine === 'true') {
    if (!req.user) { const err = new Error('Authentication required'); err.status = 401; return next(err); }
    where.authorUserId = req.user.id;
  }
  let include = [];
  if (tag) {
    const by = isNaN(tag) ? { [Op.or]: [{ name: tag }, { slug: tag }] } : { id: Number(tag) };
    include.push({ model: Tag, where: by, through: { attributes: [] } });
  } else {
    include.push({ model: Tag, through: { attributes: [] } });
  }
  const games = await Game.findAll({ where, include, order: [['createdAt','DESC']] });
  const out = [];
  for (const g of games) {
    const tags = (await g.getTags()).map(t => t.name);
    out.push({ id: g.id, title: g.title, thumbnailUrl: g.thumbnailUrl, tags, playUrl: g.playUrl });
  }
  res.json({ games: out });
});

// GET /api/games/:id
router.get('/:id', async (req, res, next) => {
  const game = await Game.findByPk(req.params.id);
  if (!game) { const err = new Error('Game not found'); err.status = 404; return next(err); }
  const payload = await serializeGame(game);
  res.json({ game: payload });
});

// POST /api/games
router.post('/', requireAuth, validateGameCreate, async (req, res) => {
  const { title, description, playUrl, thumbnailUrl, tags } = req.body;
  const game = await Game.create({ title, description, playUrl, thumbnailUrl, authorUserId: req.user.id });
  if (Array.isArray(tags)) await attachTags(game, tags);
  res.status(201).json({ game: await serializeGame(game) });
});

// PUT /api/games/:id
router.put('/:id', requireAuth, validateGameUpdate, async (req, res, next) => {
  const game = await Game.findByPk(req.params.id);
  if (!game) { const err = new Error('Game not found'); err.status = 404; return next(err); }
  if (game.authorUserId !== req.user.id) { const err = new Error('Forbidden'); err.status = 403; return next(err); }
  const fields = ['title','description','playUrl','thumbnailUrl'];
  const patch = {};
  for (const f of fields) if (f in req.body) patch[f] = req.body[f];
  await game.update(patch);
  if (Array.isArray(req.body.tags)) await attachTags(game, req.body.tags);
  res.json({ game: await serializeGame(game) });
});

// DELETE /api/games/:id
router.delete('/:id', requireAuth, async (req, res, next) => {
  const game = await Game.findByPk(req.params.id);
  if (!game) { const err = new Error('Game not found'); err.status = 404; return next(err); }
  if (game.authorUserId !== req.user.id) { const err = new Error('Forbidden'); err.status = 403; return next(err); }
  await game.destroy();
  res.json({ message: 'Deleted' });
});

// POST /api/games/:id/reviews
router.post('/:id/reviews', requireAuth, [
  check('rating').isInt({ min: 1, max: 5 }),
  check('comment').isLength({ min: 1 }),
  handleValidationErrors
], async (req, res, next) => {
  const game = await Game.findByPk(req.params.id);
  if (!game) { const err = new Error('Game not found'); err.status = 404; return next(err); }
  const { rating, comment } = req.body;
  const review = await Review.create({ gameId: game.id, userId: req.user.id, rating, comment });
  res.status(201).json({ review: { id: review.id, rating: review.rating, comment: review.comment, userId: req.user.id, username: req.user.username } });
});

module.exports = router;
