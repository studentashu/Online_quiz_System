// models/Enrollment.js
const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  enrolledAt: { type: Date, default: Date.now },
  progress: { type: Number, default: 0 }, // e.g., 0-100 % progress
  status: { type: String, enum: ['active', 'completed', 'dropped'], default: 'active' },
});

enrollmentSchema.index({ user: 1, course: 1 }, { unique: true }); // prevent duplicate enrollments

module.exports = mongoose.model('Enrollment', enrollmentSchema);
