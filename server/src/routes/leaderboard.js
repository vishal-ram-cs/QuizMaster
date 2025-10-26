import express from 'express';
import { auth } from '../middleware/auth.js';
import Attempt from '../models/Attempt.js';
import mongoose from 'mongoose';

const router = express.Router();

// GET /api/leaderboard?quizId=optional
router.get('/', auth, async (req, res) => {
  const { quizId, limit = 10 } = req.query;
  const match = {};
  if (quizId) match.quiz = new mongoose.Types.ObjectId(quizId);

  const pipeline = [
    { $match: match },
    {
      $group: {
        _id: { user: '$user', quiz: quizId ? '$quiz' : null },
        bestPercentage: { $max: '$percentage' },
        attempts: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id.user',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind: '$user' },
    {
      $project: {
        _id: 0,
        userId: '$user._id',
        name: '$user.name',
        email: '$user.email',
        role: '$user.role',
        bestPercentage: 1,
        attempts: 1
      }
    },
    { $sort: { bestPercentage: -1, attempts: 1 } },
    { $limit: Number(limit) }
  ];

  const leaderboard = await Attempt.aggregate(pipeline);
  res.json(leaderboard);
});

export default router;