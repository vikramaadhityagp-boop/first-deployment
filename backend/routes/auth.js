const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (user) => jwt.sign(
  { id: user._id, email: user.email, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

// POST /auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (await User.findOne({ email }))
      return res.status(400).json({ success: false, message: 'Email already registered', data: null });
    const user = await User.create({ name, email, password });
    const token = signToken(user);
    res.status(201).json({ success: true, message: 'Registered successfully', data: { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } } });
  } catch (err) { next(err); }
});

// POST /auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid credentials', data: null });
    const token = signToken(user);
    res.json({ success: true, message: 'Login successful', data: { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } } });
  } catch (err) { next(err); }
});

module.exports = router;
