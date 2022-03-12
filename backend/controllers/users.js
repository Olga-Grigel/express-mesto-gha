require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ConflictError = require('../errors/conflict-error');
const NotFoundError = require('../errors/not-found-error');
const CastError = require('../errors/cast-error');
const UnauthorizedError = require('../errors/unauthorized-error');

const secretKey = NODE_ENV !== 'production' ? 'some-secret-key' : JWT_SECRET;

const getUsers = (request, response, next) => {
  User
    .find({})
    .then((users) => response.status(200).send(users))
    .catch(next);
};

const getUser = (request, response, next) => {
  User
    .findById(request.params.userId)
    .orFail(new NotFoundError('Пользователь с таким ID не найден'))
    .then((user) => response.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Передан некорректный ID карточки'));
      } else {
        next(err);
      }
    });
};
const getUserMe = (request, response, next) => {
  User
    .findById(request.user._id)
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => response.status(200).send(user))
    .catch((err) => {
      if (err.message === 'NotFound') {
        next(new NotFoundError('Пользователь с таким ID не найден'));
      } else {
        next(err);
      }
    });
};

const createUser = (request, response, next) => {
  const {
    name, about, avatar, email, password,
  } = request.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => response.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new CastError('Переданы некорректные данные при создании пользователя'));
      }
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
      } else {
        next(err);
      }
    });
};
const login = (request, response, next) => {
  const { email, password } = request.body;

  return User.findOneByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна и пользователь в переменной user, создадим токен
      const token = jwt.sign({ _id: user._id }, secretKey, { expiresIn: '7d' });
      console.log(secretKey);
      // вернём токен в куки
      response
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: false,
        })
        .send({ data: user.toJSON() });
    })
    .catch((err) => {
      // ошибка аутентификации
      if (err.statusCode === 401) {
        next(new UnauthorizedError('Неверный email или пароль'));
      } else {
        next(err);
      }
    });
};

const updateUser = (request, response, next) => {
  const { name, about } = request.body;
  return User
    .findByIdAndUpdate(
      request.user._id,
      {
        name,
        about,
      },
      {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
      },
    )
    .orFail(new NotFoundError('Пользователь с таким ID не найден'))
    .then((user) => response.status(200).send(user))
    .catch((err) => {
      if (err.message === 'NotFound') {
        next(new NotFoundError('Пользователь с таким ID не найден'));
      } if (err.name === 'ValidationError') {
        next(new CastError('Переданы некорректные данные при создании пользователя'));
      } else {
        next(err);
      }
    });
};

const signout = (req, res) => {
  res
    .cookie('jwt', '')
    .end();
};

const updateUserAvatar = (request, response, next) => {
  const { avatar } = request.body;
  return User
    .findByIdAndUpdate(request.user._id, { avatar }, {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    })
    .orFail(new NotFoundError('Пользователь с таким ID не найден'))
    .then((user) => response.status(200).send(user))
    .catch((err) => {
      if (err.message === 'NotFound') {
        next(new NotFoundError('Пользователь с таким ID не найден'));
      } if (err.name === 'ValidationError') {
        next(new CastError('Переданы некорректные данные при создании пользователя'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateUserAvatar,
  login,
  getUserMe,
  signout,
};
