const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  games: [{
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
    quantity: { type: Number, default: 1 },
    price: { type: Number, required: true },
  }],
  totalAmount: { type: Number, required: true },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
