const Joi = require('joi');

const postSchema = Joi.object({
  name: Joi.string().min(3).required().messages({
    'any.required': 'missing required name field',
  }),

  email: Joi.string().min(5).required().messages({
    'any.required': 'missing required email field',
  }),
  phone: Joi.string()
    .min(6)
    .pattern(/^[0-9\s()+-]+$/)
    .required()
    .messages({
      'any.required': 'missing required phone field',
      'string.min': 'Phone number must be at least 6 characters long',
      'string.pattern.base': 'Invalid phone number format',
    }),
  favorite: Joi.boolean(),
});

const putSchema = Joi.object({
  name: Joi.string().min(3),
  email: Joi.string().min(5),
  phone: Joi.string()
    .min(6)
    .pattern(/^[0-9\s()+-]+$/),
  favorite: Joi.boolean(),
})
  .or('name', 'email', 'phone', 'favorite')
  .required()
  .messages({
    'object.missing': 'missing fields',
  });

const patchSchema = Joi.object({
  favorite: Joi.boolean().required().messages({
    'any.required': 'missing field favorite',
  }),
});
module.exports = {
  postSchema,
  putSchema,
  patchSchema,
};
