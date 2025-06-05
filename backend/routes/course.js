const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path'); // ✅ Required for file extensions

const Course = require('../models/Course');
const { authenticateToken, authorizeRoles } = require('../middleware/middleware');

// === Multer Setup ===
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'thumbnail') {
      cb(null, 'uploads/thumbnails/');
    } else if (file.fieldname === 'videos') {
      cb(null, 'uploads/videos/');
    } else {
      cb(new Error('Invalid file field'), false);
    }
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  }
});

const upload = multer({ storage });

// === Routes ===

router.post(
  '/',
  authenticateToken,
  authorizeRoles('admin'),
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'videos', maxCount: 10 }
  ]),
  async (req, res) => {
    try {
      const { title, summary } = req.body;
      const thumbnailFile = req.files['thumbnail']?.[0];
      const videoFiles = req.files['videos'] || [];

      console.log('Title:', title);
      console.log('Summary:', summary);
      console.log('Thumbnail File:', thumbnailFile);
      console.log('Video Files:', videoFiles);
      console.log('User ID:', req.user?.id);

      if (!title) {
        return res.status(400).json({ message: 'Title is required' });
      }

      if (!thumbnailFile || videoFiles.length === 0) {
        return res.status(400).json({ message: 'Thumbnail and at least one video are required.' });
      }

      const content = videoFiles.map(file => ({
        type: 'video',
        title: file.originalname,
        filename: file.filename
      }));

      const newCourse = new Course({
        title,
        summary,
        thumbnail: thumbnailFile.filename,
        content,
         createdBy: req.user.userId
      });

      await newCourse.save();
      res.status(201).json({ message: 'Course created', course: newCourse });
    } catch (err) {
      console.error('Error creating course:', err);
      res.status(500).json({ message: 'Failed to create course', error: err.message });
    }
  }
);


router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get courses', error: err.message });
  }
});

// GET single course by ID
router.get('/courses/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('createdBy', 'name');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching course' });
  }
});

// UPDATE course (Admin only)
// UPDATE course (Admin only)
router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('admin'),
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'videos', maxCount: 10 } // ✅ match your POST route
  ]),
  async (req, res) => {
    
    try {
      const course = await Course.findById(req.params.id);
      if (!course) return res.status(404).json({ message: 'Course not found' });

      const { title, summary } = req.body;
      const thumbnailFile = req.files['thumbnail']?.[0];
      const videoFiles = req.files['videos'] || [];

      // Update title and summary if provided
      if (title) course.title = title;
      if (summary) course.summary = summary;

      // Update thumbnail if uploaded
      if (thumbnailFile) {
        course.thumbnail = thumbnailFile.filename;
      }

      // Append new videos to existing content
      if (videoFiles.length > 0) {
        videoFiles.forEach(file => {
          course.content.push({
            type: 'video',
            title: file.originalname,
            filename: file.filename
          });
        });
      }

      await course.save();
      res.json({ message: 'Course updated', course });
    } catch (err) {
      console.error('Update error:', err);
      res.status(500).json({ message: 'Error updating course' });
    }
  }
);




// DELETE course (Admin only)
router.delete('/courses/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const deleted = await Course.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Course not found' });
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting course' });
  }
});

module.exports = router;
