const Joi = require('joi');

const signupSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { deny: ["ru", "su", "рус", "рф", "москва"] } })
    .error(
      (errors) =>
        new Error(
          "enter valid email: min 6, max 63 characters, except .ru, .su, .рус, .рф,.москва etc"
        )
    )
    .min(6)
    .max(63)
    // .pattern(emailRegexp)
    .required(),
  password: Joi.string()
    .min(6)
    .max(12)
    // .pattern(passwordRegExp)
    .error(
      (errors) =>
        new Error(
          "the passport must contain Latin letters: at least 1 lowercase, 1 uppercase, 1 number and be at least 6 and no more than 12 characters"
        )
    )
    .required(),
  name: Joi.string()
    .min(3)
    // .pattern(/^[a-zA-Z ]+$/)
    .max(16)
    .required(),
  city: Joi.string().required(),
  phone: Joi.string().required(),
});
// Please enter email and password and name and city and phone
// Password must be at least 6 characters

const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { deny: ["ru", "su", "рус", "рф", "москва"] } })
    .error(
      (errors) =>
        new Error(
          "enter valid email: min 6, max 63 characters, except .ru, .su, .рус, .рф,.москва etc"
        )
    )
    .min(6)
    .max(63)
    // .pattern(emailRegexp)
    .required(),
  password: Joi.string()
    .min(6)
    .max(12)
    // .pattern(passwordRegExp)
    .error(
      (errors) =>
        new Error(
          "the passport must contain Latin letters: at least 1 lowercase, 1 uppercase, 1 number and be at least 6 and no more than 12 characters"
        )
    )
    .required(),
});

module.exports = {
  signupSchema,
  loginSchema
}