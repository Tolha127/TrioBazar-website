const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Women', 'Men', 'Children']
  },  description: {
    type: String,
    required: false,
    default: ''
  },
  price: {
    type: String,
    required: false,
    default: '0'
  },  image: {
    type: String,
    default: 'placeholder.jpg'
  },
  imagePublicId: {
    type: String,
    default: null
  },
  ratings: [{
    rating: Number,
    reviewerName: String,
    reviewText: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  inStock: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);
