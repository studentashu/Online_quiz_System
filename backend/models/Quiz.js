// models/Quiz.js
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['MCQ', 'NAT'],
    required: true
  },
  questionText: {
    type: String,
    required: true
  },
  options: {
    type: [String], // Only for MCQ
    default: []
  },
  correctAnswer: {
    type: Number // Only for MCQ
  },
  answer: {
    type: Number // Only for NAT
  }
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  questions: [questionSchema],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
