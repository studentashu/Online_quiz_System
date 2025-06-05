const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Course = require('../models/Course');
const QuizAnswer = require('../models/QuizAnswer');
const Quiz = require('../models/Quiz');

const { authenticateToken, authorizeRoles } = require('../middleware/middleware');

// Apply middleware to all admin routes
router.use(authenticateToken, authorizeRoles('admin'));

// ======================= USERS =======================

// Get all users (excluding passwords)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get users', error: err.message });
  }
});

// Delete a user by ID
router.delete('/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user', error: err.message });
  }
});

// ======================= COURSES =======================

// Get all courses
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get courses', error: err.message });
  }
});

// Delete a course by ID
router.delete('/courses/:id', async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse) return res.status(404).json({ message: 'Course not found' });
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete course', error: err.message });
  }
});

// ======================= QUIZ RESULTS =======================

// Get all quiz attempt results
router.get('/quiz-results', async (req, res) => {
  try {
    const results = await QuizAnswer.find()
      .populate('user', 'name email')
      .populate('quiz', 'title');

    res.json(results);
  } catch (err) {
    console.error('Error fetching quiz results:', err);
    res.status(500).json({ message: 'Failed to fetch quiz results', error: err.message });
  }
});


// Get all quiz answers
router.get('/quizanswers', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const answers = await QuizAnswer.find();
    res.json(answers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch quiz answers', error: err.message });
  }
});





module.exports = router;
