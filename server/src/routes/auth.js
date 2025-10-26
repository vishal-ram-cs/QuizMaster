import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

const tokenCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
});

router.post(
  '/signup',
  [
    body('name').isLength({ min: 2 }).withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
    body('role').optional().isIn(['student', 'teacher'])
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password, role = 'student' } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash, role });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res
      .cookie('token', token, tokenCookieOptions())
      .status(201)
      .json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  }
);

router.post(
  '/login',
  [body('email').isEmail(), body('password').isLength({ min: 6 })],
  async (req, res) => {
    const errors = validationResult(req);
   if (!errors.isEmpty()) {
  return res.status(400).json({
    message: 'Validation failed',
    errors: errors.array()
  });
}

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res
      .cookie('token', token, tokenCookieOptions())
      .json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  }
);

router.post('/logout', (req, res) => {
  res.clearCookie('token', { ...tokenCookieOptions(), maxAge: 0 });
  res.json({ message: 'Logged out' });
});

router.get('/me', auth, (req, res) => {
  res.json({ user: req.user });
});

export default router;