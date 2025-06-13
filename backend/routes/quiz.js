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

    const { title, description, questions } = req.body;
 console.log(req.body.questions);
    if (!title || !Array.isArray(questions)) {
      return res.status(400).json({ message: 'Title and questions are required' });
    }

    // Validate questions
    for (const q of questions) {
      if (!q.questionText || !q.type) {
        return res.status(400).json({ message: 'Each question must include questionText and type' });
      }

      if (q.type === 'MCQ') {
        if (!Array.isArray(q.options) || typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer >= q.options.length) {
          return res.status(400).json({ message: 'Invalid MCQ question format' });
        }
      } else if (q.type === 'NAT') {
        if (typeof q.answer !== 'number') {
          return res.status(400).json({ message: 'NAT questions must include a numeric answer' });
        }
      } else {
        return res.status(400).json({ message: 'Invalid question type' });
      }
    }

    const quiz = new Quiz({ title, description, questions, creator: req.user.id });
    await quiz.save();
    res.status(201).json({ message: 'Quiz created', quiz });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create quiz', error: err.message });
  }
});

// Check if user attempted quiz in last 24 hrs
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

// Update quiz
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
        if (!q.questionText || !q.type) {
          return res.status(400).json({ message: 'Each question must include questionText and type' });
        }

        if (q.type === 'MCQ') {
          if (!Array.isArray(q.options) || typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer >= q.options.length) {
            return res.status(400).json({ message: 'Invalid MCQ question format' });
          }
        } else if (q.type === 'NAT') {
          if (typeof q.answer !== 'number') {
            return res.status(400).json({ message: 'Invalid NAT question format' });
          }
        } else {
          return res.status(400).json({ message: 'Invalid question type' });
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

// Delete quiz
router.delete('/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  try {
    const deleted = await Quiz.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Quiz not found' });
    res.json({ message: 'Quiz deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete quiz', error: err.message });
  }
});

// Student: Submit quiz answers
// Student: Submit quiz answers
router.post('/:id/answer', authenticateToken, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    const { answers } = req.body;
    let score = 0;

    quiz.questions.forEach((q, i) => {
      const userAnswer = answers[i];
      if (q.type === 'MCQ') {
        if (userAnswer === q.correctAnswer) score++;
      } else if (q.type === 'NAT') {
        if (Number(userAnswer) === q.answer) score++;
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

    const totalQuestions = quiz.questions.length;
    const percentage = ((score / totalQuestions) * 100).toFixed(2);

    const quizAnswer = new QuizAnswer({
      quiz: quiz._id,
      user: req.user.id,
      email: req.user.email,
      answers,
      score
    });

    await quizAnswer.save();

    res.status(201).json({
      message: 'Answer submitted',
      score,
      totalQuestions,
      percentage: Number(percentage)
    });
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

// Admin: Add question
router.post('/:id/questions', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

  const { questionText, type, options, correctAnswer, answer } = req.body;

  if (!questionText || !type) return res.status(400).json({ message: 'Missing questionText or type' });

  if (type === 'MCQ') {
    if (!Array.isArray(options) || typeof correctAnswer !== 'number' || correctAnswer < 0 || correctAnswer >= options.length) {
      return res.status(400).json({ message: 'Invalid MCQ question format' });
    }
  } else if (type === 'NAT') {
    if (typeof answer !== 'number') {
      return res.status(400).json({ message: 'NAT question must include a numeric answer' });
    }
  } else {
    return res.status(400).json({ message: 'Invalid question type' });
  }

  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    const newQuestion = { questionText, type };
    if (type === 'MCQ') {
      newQuestion.options = options;
      newQuestion.correctAnswer = correctAnswer;
    } else {
      newQuestion.answer = answer;
    }

    quiz.questions.push(newQuestion);
    await quiz.save();
    res.json({ message: 'Question added', quiz });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add question', error: err.message });
  }
});

// Admin: Delete a question by index
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
router.get('/results/:email', async (req, res) => {
  try {
    const results = await QuizAnswer.find({ email: req.params.email })
      .populate({
        path: 'quiz',
        select: 'title questions' // 👈 make sure questions are selected!
      });

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});
module.exports = router;
