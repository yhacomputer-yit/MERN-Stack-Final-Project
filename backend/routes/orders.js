const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

// User routes
router.post('/', auth, async (req, res) => {
  try {
    const { shippingInfo, paymentMethod = 'cod' } = req.body;
    if (!shippingInfo || !shippingInfo.address || !shippingInfo.city || !shippingInfo.postalCode || !shippingInfo.country) {
      return res.status(400).json({ message: 'Complete shipping information is required' });
    }

    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const total = cart.items.reduce(
      (sum, item) => sum + item.productId.price * item.quantity,
      0
    );

    const order = new Order({
      userId: req.user.id,
      items: cart.items.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.price,
      })),
      total,
      shippingInfo,
      status: 'pending',
      paymentMethod,
    });

    await order.save();
    cart.items = [];
    await cart.save();

    res.json({ message: 'Order created successfully', order });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(400).json({ message: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate('items.productId', 'name price')
      .populate('userId', 'name');
    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Admin routes
router.get('/admin/orders', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    const orders = await Order.find()
      .populate('items.productId', 'name price')
      .populate('userId', 'name');
    console.log('Fetched admin orders:', orders); // Debug
    res.json(orders);
  } catch (error) {
    console.error('Get admin orders error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.put('/admin/orders/:id', auth, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { status } = req.body;
    if (req.user.role !== 'admin') {
      await session.abortTransaction();
      return res.status(403).json({ message: 'Admin access required' });
    }

    if (!['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findById(req.params.id)
      .populate('items.productId', 'name price')
      .session(session);
    if (!order) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Order not found' });
    }

    // If updating to 'confirmed' and not previously confirmed, deduct stock
    if (status === 'confirmed' && order.status !== 'confirmed') {
      for (const item of order.items) {
        const product = await Product.findById(item.productId._id).session(session);
        if (!product) {
          await session.abortTransaction();
          return res.status(404).json({ message: `Product ${item.productId._id} not found` });
        }
        if (product.stock < item.quantity) {
          await session.abortTransaction();
          return res.status(400).json({ message: `Insufficient stock for product ${product.name}` });
        }
        product.stock -= item.quantity;
        await product.save({ session });
      }
    }

    // If reverting from 'confirmed' to another status, restore stock
    if (order.status === 'confirmed' && status !== 'confirmed') {
      for (const item of order.items) {
        const product = await Product.findById(item.productId._id).session(session);
        if (product) {
          product.stock += item.quantity;
          await product.save({ session });
        }
      }
    }

    order.status = status;
    const updatedOrder = await order.save({ session });

    await session.commitTransaction();
    const populatedOrder = await Order.findById(req.params.id)
      .populate('items.productId', 'name price')
      .populate('userId', 'name');
    console.log('Updated admin order:', populatedOrder); // Debug
    res.json(populatedOrder);
  } catch (error) {
    await session.abortTransaction();
    console.error('Update admin order error:', error);
    res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
  }
});

module.exports = router;