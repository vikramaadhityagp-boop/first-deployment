const router = require('express').Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Game = require('../models/Game');
const User = require('../models/User');
const { auth } = require('../middleware/authMiddleware');

let razorpay;

const getRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw Object.assign(new Error('Razorpay environment variables are not configured'), { status: 500 });
  }

  if (!razorpay) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  return razorpay;
};

// POST /orders - create order + Razorpay order
router.post('/', auth, async (req, res, next) => {
  try {
    const { items } = req.body; // [{ gameId, quantity }]
    const gameIds = items.map(i => i.gameId);
    const games = await Game.find({ _id: { $in: gameIds } });

    let totalAmount = 0;
    const orderGames = items.map(item => {
      const game = games.find(g => g._id.toString() === item.gameId);
      if (!game) throw Object.assign(new Error(`Game ${item.gameId} not found`), { status: 404 });
      if (game.stock < item.quantity) throw Object.assign(new Error(`Insufficient stock for ${game.title}`), { status: 400 });
      const price = game.discountPrice || game.price;
      totalAmount += price * item.quantity;
      return { game: game._id, quantity: item.quantity, price };
    });

    // Create Razorpay order (amount in paise)
    const rzpOrder = await getRazorpay().orders.create({
      amount: Math.round(totalAmount * 100),
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    });

    const order = await Order.create({
      userId: req.user.id,
      games: orderGames,
      totalAmount,
      razorpayOrderId: rzpOrder.id,
    });

    res.status(201).json({
      success: true,
      message: 'Order created',
      data: { order, razorpayOrderId: rzpOrder.id, amount: rzpOrder.amount, currency: rzpOrder.currency, keyId: process.env.RAZORPAY_KEY_ID },
    });
  } catch (err) { next(err); }
});

// POST /orders/verify - verify Razorpay payment
router.post('/verify', auth, async (req, res, next) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    if (!process.env.RAZORPAY_KEY_SECRET) {
      throw Object.assign(new Error('Razorpay environment variables are not configured'), { status: 500 });
    }

    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSig = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body).digest('hex');

    if (expectedSig !== razorpaySignature)
      return res.status(400).json({ success: false, message: 'Payment verification failed', data: null });

    const order = await Order.findOneAndUpdate(
      { razorpayOrderId },
      { razorpayPaymentId, status: 'paid' },
      { new: true }
    );

    // Update stock and user purchasedGames
    for (const item of order.games) {
      await Game.findByIdAndUpdate(item.game, { $inc: { stock: -item.quantity } });
    }
    await User.findByIdAndUpdate(order.userId, { $addToSet: { purchasedGames: { $each: order.games.map(g => g.game) } } });

    res.json({ success: true, message: 'Payment verified', data: order });
  } catch (err) { next(err); }
});

// GET /orders/:userId
router.get('/:userId', auth, async (req, res, next) => {
  try {
    if (req.user.id !== req.params.userId && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Forbidden', data: null });
    const orders = await Order.find({ userId: req.params.userId }).populate('games.game', 'title coverImage price').sort({ createdAt: -1 });
    res.json({ success: true, message: 'Orders fetched', data: orders });
  } catch (err) { next(err); }
});

module.exports = router;
