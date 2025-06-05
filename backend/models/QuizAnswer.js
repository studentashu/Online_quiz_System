const mongoose = require('mongoose');

const quizAnswerSchema = new mongoose.Schema({
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  email: { type: String, required: true }, // ✅ NEW FIELD
  answers: [Number],
  score: Number,
}, { timestamps: true });

module.exports = mongoose.model('QuizAnswer', quizAnswerSchema);
