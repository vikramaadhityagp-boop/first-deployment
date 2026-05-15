const router = require('express').Router();
const Game = require('../models/Game');
const { auth, adminOnly } = require('../middleware/authMiddleware');

// GET /games - list with filters
router.get('/', async (req, res, next) => {
  try {
    const { genre, platform, minPrice, maxPrice, search, page = 1, limit = 12 } = req.query;
    const filter = {};
    if (genre) filter.genre = genre;
    if (platform) filter.platform = platform;
    if (minPrice || maxPrice) filter.price = { ...(minPrice && { $gte: +minPrice }), ...(maxPrice && { $lte: +maxPrice }) };
    if (search) filter.title = { $regex: search, $options: 'i' };

    const games = await Game.find(filter)
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .sort({ createdAt: -1 });
    const total = await Game.countDocuments(filter);
    res.json({ success: true, message: 'Games fetched', data: { games, total, page: +page } });
  } catch (err) { next(err); }
});

// GET /games/:id
router.get('/:id', async (req, res, next) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ success: false, message: 'Game not found', data: null });
    res.json({ success: true, message: 'Game fetched', data: game });
  } catch (err) { next(err); }
});

// POST /games - admin only
router.post('/', auth, adminOnly, async (req, res, next) => {
  try {
    const game = await Game.create(req.body);
    res.status(201).json({ success: true, message: 'Game created', data: game });
  } catch (err) { next(err); }
});

// PUT /games/:id - admin only
router.put('/:id', auth, adminOnly, async (req, res, next) => {
  try {
    const game = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: 'Game updated', data: game });
  } catch (err) { next(err); }
});

module.exports = router;
