const Card = require('../models/card');
const ForbiddenError = require('../errors/forbidden-error');
const NotFoundError = require('../errors/not-found-error');
const CastError = require('../errors/cast-error');

const getCards = (request, response, next) => {
  Card
    .find({})
    .then((cards) => response.status(200).send(cards))
    .catch((err) => {
      next(err);
    });
};

const createCard = (request, response, next) => {
  const { name, link } = request.body;
  const owner = request.user._id;
  return Card
    .create({ name, link, owner })
    .then((card) => response.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new CastError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

const likeCard = (request, response, next) => {
  Card
    .findByIdAndUpdate(
      request.params.cardId,
      { $addToSet: { likes: request.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    )
    .orFail(new NotFoundError('Нет карточки по заданному ID'))
    .then((card) => response.status(201).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Передан некорректный ID карточки'));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (request, response, next) => {
  Card
    .findByIdAndUpdate(
      request.params.cardId,
      { $pull: { likes: request.user._id } }, // убрать _id из массива
      { new: true },
    )
    .orFail(new NotFoundError('Нет карточки по заданному ID'))
    .then((card) => response.status(201).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Передан некорректный ID карточки'));
      } else {
        next(err);
      }
    });
};

const deleteCard = (request, response, next) => {
  const { cardId } = request.params;
  return Card
    .findById(cardId)
    .orFail(new NotFoundError('Нет карточки по заданному ID'))
    .then((card) => {
      if (!card.owner.equals(request.user._id)) {
        return next(new ForbiddenError('Нельзя удалить чужую карточку'));
      }
      return card.remove()
        .then(() => response.send({ message: 'Карточка удалена' }));
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
