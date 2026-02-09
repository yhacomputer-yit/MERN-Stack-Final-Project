// cart.js (backend)
const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// Get user's cart
router.get('/', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate({
      path: 'items.productId',
      select: 'name price imageURLs',
    });
    if (!cart) return res.json({ items: [] });
    // Filter out items with null productId (e.g., deleted products)
    cart.items = cart.items.filter(item => item.productId !== null);
    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Add item to cart
router.post('/', auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
      return res.status(400).json({ message: 'Product ID and quantity are required' });
    }
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
    }
    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }
    await cart.save();
    // Fetch and populate the cart
    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.productId',
      select: 'name price imageURLs',
    });
    if (!populatedCart) return res.status(500).json({ message: 'Failed to populate cart' });
    // Filter out null productIds
    populatedCart.items = populatedCart.items.filter(item => item.productId !== null);
    await populatedCart.save();
    res.status(201).json(populatedCart);
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update item quantity in cart
router.put('/', auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
      return res.status(400).json({ message: 'Product ID and quantity are required' });
    }
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex === -1) return res.status(404).json({ message: 'Item not in cart' });
    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    // Fetch and populate the cart
    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.productId',
      select: 'name price imageURLs',
    });
    if (!populatedCart) return res.status(500).json({ message: 'Failed to populate cart' });
    populatedCart.items = populatedCart.items.filter(item => item.productId !== null);
    await populatedCart.save();
    res.json(populatedCart);
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Remove item from cart
router.delete('/:productId', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.items = cart.items.filter(item => item.productId.toString() !== req.params.productId);
    await cart.save();
    // Fetch and populate the cart
    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.productId',
      select: 'name price imageURLs',
    });
    if (!populatedCart) return res.status(500).json({ message: 'Failed to populate cart' });
    populatedCart.items = populatedCart.items.filter(item => item.productId !== null);
    await populatedCart.save();
    res.json(populatedCart);
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;