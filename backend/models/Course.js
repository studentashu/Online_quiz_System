const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  summary: {
    type: String
  },

  // Thumbnail image filename (e.g., "thumbnail1.png")
  thumbnail: {
    type: String,
    required: true
  },

  // Course content: videos or PDFs (admin-uploaded)
  content: [
    {
      type: {
        type: String,
        enum: ['video', 'pdf'],
        required: true
      },
      title: {
        type: String,
        required: true
      },
      filename: {
        type: String,
        required: true // e.g., "lesson1.mp4"
      }
    }
  ],

  // Admin who created the course
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Users enrolled in the course
  enrolledUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);
