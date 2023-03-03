const { RequestError } = require('../helpers');

const validateStatus = schema => {
  const func = (req, _, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      next(RequestError(400, `missing field favorite — ${error.message}`))
    }
    next()
  };

  return func;
};

module.exports = validateStatus;