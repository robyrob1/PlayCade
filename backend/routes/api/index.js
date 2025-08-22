const router = require('express').Router();
const sessionRouter = require('./session');
const usersRouter = require('./users');
const gamesRouter = require('./games');
const reviewsRouter = require('./reviews');
const commentsRouter = require('./comments');
const tagsRouter = require('./tags');
const { restoreUser } = require('../../utils/auth');

router.use(restoreUser);
router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/games', gamesRouter);
router.use('/reviews', reviewsRouter);
router.use('/comments', commentsRouter);
router.use('/tags', tagsRouter);

module.exports = router;
