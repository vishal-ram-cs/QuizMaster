import express from 'express';
import { body, validationResult } from 'express-validator';
import { auth } from '../middleware/auth.js';
import { requireTeacher } from '../middleware/roles.js';
import Quiz from '../models/Quiz.js';

const router = express.Router();

const quizValidators = [
  body('title').isLength({ min: 3 }),
  body('category').notEmpty(),
  body('difficulty').isIn(['Easy', 'Medium', 'Hard']),
  body('duration').isInt({ min: 1 }),
  body('passPercent').isInt({ min: 1, max: 100 }),
  body('questions').isArray({ min: 1 }),
  body('questions.*.text').notEmpty(),
  body('questions.*.options').isArray({ min: 2 }),
  body('questions.*.correctIndex').isInt({ min: 0 }),
  body('questions.*.marks').optional().isInt({ min: 1 })
];

const hideAnswers = (quiz) => {
  const q = quiz.toObject();
  q.questions = q.questions.map(({ correctIndex, ...rest }) => rest);
  return q;
};

router.get('/', auth, async (req, res) => {
  const { category, difficulty, limit = 50 } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (difficulty) filter.difficulty = difficulty;
  const quizzes = await Quiz.find(filter).sort({ createdAt: -1 }).limit(Number(limit));
  res.json(quizzes.map(hideAnswers));
});

router.get('/mine', auth, requireTeacher, async (req, res) => {
  const quizzes = await Quiz.find({ creator: req.user._id }).sort({ createdAt: -1 });
  res.json(quizzes);
});

router.get('/:id', auth, async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
  res.json(hideAnswers(quiz));
});

router.post('/', auth, requireTeacher, quizValidators, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const quiz = await Quiz.create({ ...req.body, creator: req.user._id });
  res.status(201).json(quiz);
});

router.put('/:id', auth, requireTeacher, quizValidators, async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) return res.status(404).json({ message: 'Not found' });
  if (quiz.creator.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Not owner' });

  Object.assign(quiz, req.body);
  await quiz.save();
  res.json(quiz);
});

router.delete('/:id', auth, requireTeacher, async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) return res.status(404).json({ message: 'Not found' });
  if (quiz.creator.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Not owner' });

  await quiz.deleteOne();
  res.json({ message: 'Deleted' });
});

export default router;