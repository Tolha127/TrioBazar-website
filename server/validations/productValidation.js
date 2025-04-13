const joi = require('joi');

const productSchema = joi.object({
  name: joi.string().required().min(3).max(100),
  code: joi.string().required().min(2).max(20),
  category: joi.string().required(),
  description: joi.string().allow('').max(1000).optional(),
  price: joi.string().allow('').optional(),
  image: joi.any().optional()
});

module.exports = { productSchema };
