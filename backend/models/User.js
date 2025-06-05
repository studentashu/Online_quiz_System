const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'] },
  avatar: { type: String }, // general avatar (can be kept or replaced)
  description: { type: String },

  address: { type: String },
  phoneNumber: { type: String },
  collegeName: { type: String },
  collegeId: { type: String },
  profilePicture: { type: String }, // path or URL to profile image
  collegeIdCard: { type: String },  // path or URL to uploaded college ID card image

  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
