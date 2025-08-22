const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const isProduction = process.env.NODE_ENV === 'production';

const app = express();
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
if (!isProduction) app.use(cors());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(csurf({ cookie: { secure: isProduction, sameSite: isProduction && 'Lax', httpOnly: true } }));

app.get('/api/csrf/restore', (req, res) => {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  return res.json({ 'XSRF-Token': req.csrfToken() });
});

app.use(routes);

const { ValidationError } = require('sequelize');
app.use((_req, _res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.title = "Resource Not Found";
  err.errors = { message: "The requested resource couldn't be found." };
  err.status = 404;
  next(err);
});
app.use((err, _req, _res, next) => {
  if (err instanceof ValidationError) {
    let errors = {};
    for (let e of err.errors) errors[e.path] = e.message;
    err.title = 'Validation error';
    err.errors = errors;
  }
  next(err);
});
app.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  res.json({ title: err.title || 'Server Error', message: err.message, errors: err.errors, stack: isProduction ? null : err.stack });
});

module.exports = app;
