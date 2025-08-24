const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const { initDb } = require('./db/models');

const isProduction = process.env.NODE_ENV === 'production';
const app = express();

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());

if (!isProduction) {
  app.use(cors({ origin: true, credentials: true }));
} else {
 
  app.use(cors({
    origin: process.env.FRONTEND_ORIGIN, 
    credentials: true
  }));
}

app.use(helmet({ crossOriginResourcePolicy: false }));

app.use(routes);

// 404
app.use((_req, _res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  res.json({
    title: err.title || 'Server Error',
    message: err.message,
    errors: err.errors,
    stack: isProduction ? null : err.stack
  });
});

initDb();

module.exports = app;
