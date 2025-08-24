const { validationResult } = require('express-validator');

const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const err = new Error('Validation error');
    err.errors = {};
    validationErrors.array().forEach(e => err.errors[e.param] = e.msg);
    err.status = 400;
    err.title = 'Bad request';
    return next(err);
  }
  next();
};

module.exports = { handleValidationErrors };
