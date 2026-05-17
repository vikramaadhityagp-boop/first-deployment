require('dotenv').config();
const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const mongoose = require('mongoose');

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

// DB connection (cached for Lambda)
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
};

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

// Routes
app.use('/games', require('./routes/games'));
app.use('/auth', require('./routes/auth'));
app.use('/orders', require('./routes/orders'));
app.use('/api/games', require('./routes/games'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/orders'));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Server error', data: null });
});

module.exports = app;
module.exports.app = app;
module.exports.handler = serverless(app);
