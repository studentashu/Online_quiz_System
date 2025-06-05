// routes/enrollments.js
const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const { authenticateToken, authorizeRoles } = require('../middleware/middleware');


// Create: Enroll in a course
router.post('/enroll', authenticateToken, async (req, res) => {
  const { courseId } = req.body;
  const userId = req.user.userId; // ✅ Correct usage based on middleware

  if (!courseId) {
    return res.status(400).json({ message: 'Course ID is required' });
  }

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const alreadyEnrolled = await Enrollment.findOne({ user: userId, course: courseId });
    if (alreadyEnrolled) {
      return res.status(400).json({ message: 'Already enrolled' });
    }

    const enrollment = new Enrollment({ user: userId, course: courseId });
    await enrollment.save();

    return res.status(201).json({ message: 'Enrolled successfully', enrollment });
  } catch (err) {
    console.error('Enrollment error:', err); // log for debugging
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


// Read: Get one enrollment by ID (only if owner)
router.get('/enrollments/:id', authenticateToken, async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id).populate('course', 'title summary');
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });
    if (!enrollment.user.equals(req.user._id)) return res.status(403).json({ message: 'Forbidden' });

    res.json(enrollment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
// Read: Get all enrollments for the authenticated user
router.get('/enrollments', authenticateToken, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user.userId })
    
      .populate('course', 'title summary thumbnail') // populate course details
      .sort({ createdAt: -1 }); // optional: latest first

    const enrolledCourseIds = enrollments.map(e => e.course._id.toString());

    res.json({ enrollments, enrolledCourseIds });
  } catch (err) {
    console.error('Error fetching enrollments:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Update: Update enrollment (e.g., progress, status)
router.put('/enrollments/:id', authenticateToken, async (req, res) => {
  const { progress, status } = req.body;

  try {
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });
    if (!enrollment.user.equals(req.user._id)) return res.status(403).json({ message: 'Forbidden' });

    if (progress !== undefined) enrollment.progress = progress;
    if (status !== undefined) {
      if (!['active', 'completed', 'dropped'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
      enrollment.status = status;
    }

    await enrollment.save();
    res.json({ message: 'Enrollment updated', enrollment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete: Unenroll (delete enrollment)
router.delete('/enrollments/:id', authenticateToken, async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });
    if (!enrollment.user.equals(req.user._id)) return res.status(403).json({ message: 'Forbidden' });

    await enrollment.remove();
    res.json({ message: 'Unenrolled successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
