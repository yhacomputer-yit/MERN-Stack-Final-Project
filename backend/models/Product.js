const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  imageURLs: [{ type: String }],
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);