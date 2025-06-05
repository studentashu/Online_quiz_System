const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const multer = require('multer');
const { authenticateToken } = require('../middleware/middleware'); // ✅ Use your middleware

const router = express.Router();

// ========== MULTER SETUP ==========
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure uploads folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// ========== GENERATE RANDOM PASSWORD ==========
const generateRandomPassword = () => {
  return Math.random().toString(36).slice(-8);
};

// ========== USER REGISTRATION ==========
router.post(
  '/register',
  upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'collegeIdCard', maxCount: 1 }
  ]),
  async (req, res) => {
    const {
      name,
      email,
      role,
      address,
      phoneNumber,
      collegeName,
      collegeId
    } = req.body;

    try {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const randomPassword = generateRandomPassword();
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      const profilePicture = req.files['profilePicture']?.[0]
  ? 'uploads/' + req.files['profilePicture'][0].filename
  : '';

const collegeIdCard = req.files['collegeIdCard']?.[0]
  ? 'uploads/' + req.files['collegeIdCard'][0].filename
  : '';


      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role: role || 'student',
        address,
        phoneNumber,
        collegeName,
        collegeId,
        profilePicture,
        collegeIdCard
      });

      await newUser.save();

      // ========== SEND EMAIL ==========
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Account Password',
        text: `Hello ${name},\n\nYour account has been created.\nYour password is: ${randomPassword}\n\nPlease change it after logging in.`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.error('Email error:', error);
        else console.log('Email sent:', info.response);
      });

      res.status(201).json({ message: 'User registered and email sent' });
    } catch (err) {
      console.error('Registration error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// ========== UPDATE PASSWORD ==========
router.post('/update-password', authenticateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Old password is incorrect' });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Password update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
