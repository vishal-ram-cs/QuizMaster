import express from 'express';
import { body, validationResult } from 'express-validator';
import { auth } from '../middleware/auth.js';
import Quiz from '../models/Quiz.js';
import Attempt from '../models/Attempt.js';

const router = express.Router();

router.get('/me', auth, async (req, res) => {
  const attempts = await Attempt.find({ user: req.user._id })
    .populate('quiz', 'title category difficulty passPercent')
    .sort({ createdAt: -1 });
  res.json(attempts);
});

router.post(
  '/',
  auth,
  [body('quizId').isMongoId(), body('answers').isArray()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { quizId, answers, timeTaken = 0 } = req.body;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    if (answers.length !== quiz.questions.length) {
      return res.status(400).json({ message: 'Answers length mismatch' });
    }

    let score = 0;
    let total = 0;
    quiz.questions.forEach((q, idx) => {
      total += q.marks ?? 1;
      if (answers[idx] === q.correctIndex) score += q.marks ?? 1;
    });

    const percentage = Math.round((score / total) * 100);
    const passed = percentage >= quiz.passPercent;

    const attempt = await Attempt.create({
      user: req.user._id,
      quiz: quiz._id,
      answers,
      score,
      total,
      percentage,
      passed,
      timeTaken
    });

    res.status(201).json({ attemptId: attempt._id, score, total, percentage, passed });
  }
);

export default router;