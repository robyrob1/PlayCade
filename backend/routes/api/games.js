const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { Game, Review, Comment, User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateGame = [
  check('title').exists({checkFalsy:true}).isLength({min:2}),
  check('description').exists({checkFalsy:true}),
  check('playUrl').exists({checkFalsy:true}).isURL(),
  handleValidationErrors
];

router.get('/', async (req, res) => {
  const games = await Game.findAll({
    include: [{ model: Review, attributes: [] }],
    attributes: {
      include: [
        [Game.sequelize.fn('ROUND', Game.sequelize.fn('AVG', Game.sequelize.col('Reviews.rating')), 2), 'avgRating'],
        [Game.sequelize.fn('COUNT', Game.sequelize.col('Reviews.id')), 'reviewCount']
      ]
    },
    group: ['Game.id']
  });
  res.json({ games });
});

router.post('/', requireAuth, validateGame, async (req, res) => {
  const { title, description, playUrl, thumbnailUrl } = req.body;
  const game = await Game.create({ title, description, playUrl, thumbnailUrl, authorUserId: req.user.id });
  res.status(201).json({ game });
});

router.get('/:id', async (req, res, next) => {
  const game = await Game.findByPk(req.params.id, {
    include: [
      { model: Review, include: [{ model: User, attributes: ['id','username'] }] },
      { model: Comment, include: [{ model: User, attributes: ['id','username'] }] },
      { association: 'tags' }
    ]
  });
  if (!game) { const err = new Error('Game not found'); err.status = 404; return next(err); }
  res.json({ game });
});

router.put('/:id', requireAuth, validateGame, async (req, res, next) => {
  const game = await Game.findByPk(req.params.id);
  if (!game) { const err = new Error('Game not found'); err.status=404; return next(err); }
  if (game.authorUserId !== req.user.id) { const err = new Error('Forbidden'); err.status=403; return next(err); }
  const { title, description, playUrl, thumbnailUrl } = req.body;
  await game.update({ title, description, playUrl, thumbnailUrl });
  res.json({ game });
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  const game = await Game.findByPk(req.params.id);
  if (!game) { const err = new Error('Game not found'); err.status=404; return next(err); }
  if (game.authorUserId !== req.user.id) { const err = new Error('Forbidden'); err.status=403; return next(err); }
  await game.destroy();
  res.json({ message: 'Deleted' });
});

router.post('/:id/tags/:tagId', requireAuth, async (req, res, next) => {
  const game = await Game.findByPk(req.params.id);
  if (!game) { const err = new Error('Game not found'); err.status=404; return next(err); }
  if (game.authorUserId !== req.user.id) { const err = new Error('Forbidden'); err.status=403; return next(err); }
  const [gt, created] = await game.sequelize.models.GameTag.findOrCreate({ where: { gameId: game.id, tagId: req.params.tagId } });
  res.status(created ? 201 : 200).json({ ok: true });
});

router.delete('/:id/tags/:tagId', requireAuth, async (req, res, next) => {
  const game = await Game.findByPk(req.params.id);
  if (!game) { const err = new Error('Game not found'); err.status=404; return next(err); }
  if (game.authorUserId !== req.user.id) { const err = new Error('Forbidden'); err.status=403; return next(err); }
  const count = await game.sequelize.models.GameTag.destroy({ where: { gameId: game.id, tagId: req.params.tagId } });
  res.json({ removed: count > 0 });
});

module.exports = router;
