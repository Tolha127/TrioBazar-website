const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');
const auth = require('../middleware/auth');

// Get all testimonials
router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create testimonial (protected)
router.post('/', auth, async (req, res) => {
  const testimonial = new Testimonial({
    text: req.body.text,
    name: req.body.name,
    role: req.body.role,
    gender: req.body.gender
  });

  try {
    const newTestimonial = await testimonial.save();
    res.status(201).json(newTestimonial);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update testimonial (protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    Object.assign(testimonial, req.body);
    const updatedTestimonial = await testimonial.save();
    res.json(updatedTestimonial);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete testimonial (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    await testimonial.remove();
    res.json({ message: 'Testimonial deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
