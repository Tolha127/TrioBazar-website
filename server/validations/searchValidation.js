const joi = require('joi');

const productSearchSchema = joi.object({
  query: joi.string().allow('').optional(),
  category: joi.string().allow('').optional(),
  minPrice: joi.number().allow('').optional(),
  maxPrice: joi.number().allow('').optional(),
  sortBy: joi.string().valid('name', 'price', 'createdAt').optional(),
  sortOrder: joi.string().valid('asc', 'desc').optional(),
  page: joi.number().integer().min(1).default(1).optional(),
  limit: joi.number().integer().min(1).max(50).default(10).optional()
});

module.exports = { 
  productSearchSchema 
};
