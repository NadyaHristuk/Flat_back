const { RequestError } = require('../helpers');

const validateBody = schema => (req, _, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    next(RequestError(400, `missing required field — ${error.message}`))
  }
  next();
};

module.exports = validateBody;