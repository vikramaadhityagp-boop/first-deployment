const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  genre: { type: String, enum: ['Action', 'RPG', 'Sports', 'FPS', 'Strategy'], required: true },
  platform: [{ type: String, enum: ['PC', 'PS5', 'Xbox', 'Nintendo Switch'] }],
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  coverImage: { type: String, default: '' },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  stock: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Game', gameSchema);
