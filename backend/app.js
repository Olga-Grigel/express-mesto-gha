require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const cors = require('cors');
const { urlPattern } = require('./config');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const {
  createUser,
  login,
  signout,
} = require('./controllers/users');
const routes = require('./routes');
const errorHandler = require('./middlewares/error-handler');

const { PORT = 3001 } = process.env;
const app = express();
app.use(cookieParser());
app.use(cors({
  origin: 'https://olgagrigel.students.nomoredomains.work', // домен фронтенда
  credentials: true, // для того, чтобы CORS поддерживал кроссдоменные куки
}));
app.use(express.json());
app.use(requestLogger); // подключаем логгер запросов
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(urlPattern),
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
}), createUser);
app.post('/signout', signout);
app.use(routes);

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});
app.use(errorLogger); // подключаем логгер ошибок
app.use(errors()); // обработчик ошибок celebrate
app.use(errorHandler);// централизованный обработчик
app.listen(PORT, () => { });

app.get('/', (req, res) => {
  res.send('hello');
});
