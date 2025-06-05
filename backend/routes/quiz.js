const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const QuizAnswer = require('../models/QuizAnswer');
const { authenticateToken } = require('../middleware/middleware');

// Admin: Create quiz
router.post('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can create quizzes' });
    }

    const quiz = new Quiz({ ...req.body, creator: req.user.id });
    await quiz.save();
    res.status(201).json({ message: 'Quiz created', quiz });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create quiz', error: err.message });
  }
});

// Check if user attempted this quiz in the last 24 hours
router.get('/:id/check-attempt', authenticateToken, async (req, res) => {
  try {
    const quizId = req.params.id;
    const email = req.user.email;

    const recentAttempt = await QuizAnswer.findOne({
      quiz: quizId,
      email,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    res.json({ attempted: !!recentAttempt });
  } catch (err) {
    res.status(500).json({ message: 'Failed to check quiz attempt', error: err.message });
  }
});

// Get all quizzes
router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch quizzes' });
  }
});

// Get single quiz
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get quiz' });
  }
});

// Admin: Update quiz
router.put('/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    const { title, questions } = req.body;

    if (title !== undefined) quiz.title = title;

    if (questions !== undefined) {
      if (!Array.isArray(questions)) {
        return res.status(400).json({ message: 'Questions must be an array' });
      }

      for (const q of questions) {
        if (
          typeof q.questionText !== 'string' ||
          !Array.isArray(q.options) ||
          typeof q.correctAnswer !== 'number' ||
          q.correctAnswer < 0 ||
          q.correctAnswer >= q.options.length
        ) {
          return res.status(400).json({ message: 'Invalid question format' });
        }
      }

      quiz.questions = questions;
    }

    await quiz.save();
    res.json({ message: 'Quiz updated', quiz });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update quiz', error: err.message });
  }
});

// Admin: Delete quiz
router.delete('/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  try {
    const deleted = await Quiz.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.json({ message: 'Quiz deleted successfully' });
  } catch (err) {
    console.error("Error deleting quiz:", err);
    res.status(500).json({ message: 'Failed to delete quiz', error: err.message });
  }
});

// Student: Submit quiz answer
router.post('/:id/answer', authenticateToken, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    const { answers } = req.body;
    let score = 0;

    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) {
        score++;
      }
    });

    const existing = await QuizAnswer.findOne({
      quiz: quiz._id,
      email: req.user.email,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    if (existing) {
      return res.status(400).json({ message: 'You already submitted this quiz in the last 24 hours' });
    }

    const quizAnswer = new QuizAnswer({
      quiz: quiz._id,
      user: req.user.id,
      email: req.user.email,
      answers,
      score
    });

    await quizAnswer.save();
    res.status(201).json({ message: 'Answer submitted', score });
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit answer', error: err.message });
  }
});

// Admin: View quiz submissions
router.get('/:id/answers', authenticateToken, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    if (quiz.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view answers' });
    }

    const answers = await QuizAnswer.find({ quiz: quiz._id }).populate('user', 'name email');
    res.json(answers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch answers', error: err.message });
  }
});

// Admin: Add new question to quiz
router.post('/:id/questions', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

  const { questionText, options, correctAnswer } = req.body;

  if (
    typeof questionText !== 'string' ||
    !Array.isArray(options) ||
    typeof correctAnswer !== 'number' ||
    correctAnswer < 0 ||
    correctAnswer >= options.length
  ) {
    return res.status(400).json({ message: 'Invalid question format' });
  }

  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    quiz.questions.push({ questionText, options, correctAnswer });
    await quiz.save();
    res.json({ message: 'Question added', quiz });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add question', error: err.message });
  }
});

// Admin: Delete a question from quiz by index
router.delete('/:id/questions/:index', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

  const index = parseInt(req.params.index);

  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    if (index < 0 || index >= quiz.questions.length) {
      return res.status(400).json({ message: 'Invalid question index' });
    }

    quiz.questions.splice(index, 1);
    await quiz.save();
    res.json({ message: 'Question deleted', quiz });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete question', error: err.message });
  }
});

module.exports = router;
