const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Review = require('../models/Review');

router.get('/', async (req, res) => {
  try {
    const products = await Product.find().populate('categoryId', 'name');
    const productsWithRatings = await Promise.all(products.map(async product => {
      const reviews = await Review.find({ productId: product._id });
      const averageRating = reviews.length
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;
      return { ...product.toObject(), averageRating };
    }));
    res.json(productsWithRatings);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('categoryId', 'name');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const reviews = await Review.find({ productId: product._id });
    const averageRating = reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;
    res.json({ ...product.toObject(), averageRating });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;