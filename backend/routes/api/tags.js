const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { Tag } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateTag = [
  check('name').exists({checkFalsy:true}).isLength({min:2}),
  check('slug').exists({checkFalsy:true}).isLength({min:2}),
  handleValidationErrors
];

router.get('/', async (_req, res) => {
  const tags = await Tag.findAll({ order: [['name','ASC']] });
  res.json({ tags });
});

router.get('/:id', async (req, res, next) => {
  const tag = await Tag.findByPk(req.params.id);
  if (!tag) { const err = new Error('Not found'); err.status=404; return next(err); }
  res.json({ tag });
});

router.post('/', requireAuth, validateTag, async (req, res) => {
  const tag = await Tag.create(req.body);
  res.status(201).json({ tag });
});

router.put('/:id', requireAuth, validateTag, async (req, res, next) => {
  const tag = await Tag.findByPk(req.params.id);
  if (!tag) { const err = new Error('Not found'); err.status=404; return next(err); }
  await tag.update(req.body);
  res.json({ tag });
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  const tag = await Tag.findByPk(req.params.id);
  if (!tag) { const err = new Error('Not found'); err.status=404; return next(err); }
  await tag.destroy();
  res.json({ message: 'Deleted' });
});

module.exports = router;
