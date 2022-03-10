const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const NotFoundError = require('../errors/not-found-error');
const auth = require('../middlewares/auth');

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.get('/signout', (req, res) => {
  res.status(200).clearCookie('jwt').send({ message: 'Выход' });
});

router.use('/*', auth, (request, response, next) => {
  next(new NotFoundError(`Ресурс по адресу "${request.path}" не найден`));
});

module.exports = router;
