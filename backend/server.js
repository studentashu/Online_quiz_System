require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const xlsx = require('xlsx');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const User = require('./models/User');

// Route imports
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const courseRoutes = require('./routes/course');
const quizRoutes = require('./routes/quiz');
const followRoutes = require('./routes/follow');
const notificationRoutes = require('./routes/notification');
const adminRoutes = require('./routes/admin');
const enrollmentsRoutes = require('./routes/enrollments');


const app = express();

// ======================= MIDDLEWARE =======================
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// ======================= DATABASE =======================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// ======================= STATIC FILES =======================
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure all upload directories exist
const uploadDirs = [
  path.join(__dirname, 'uploads'),
  path.join(__dirname, 'uploads/thumbnails'),
  path.join(__dirname, 'uploads/videos')
];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
});

// ======================= EXCEL UPLOAD =======================
const upload = multer({ storage: multer.memoryStorage() });
app.post('/upload-users-excel', upload.single("file"), async (req, res) => {
  try {
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    const savedEmails = [];

    for (const user of data) {
      if (!user.email || !user.password || !user.name) continue;

      const exists = await User.findOne({ email: user.email });
      if (!exists) {
        const hashedPassword = await bcrypt.hash(String(user.password), 10);

        const newUser = new User({
          name: user.name,
          email: user.email,
          password: hashedPassword,
          role: user.role && ['student', 'admin'].includes(user.role.toLowerCase())
            ? user.role.toLowerCase()
            : 'student'
        });

        await newUser.save();
        savedEmails.push(user.email);
      }
    }

    res.json({ message: "Upload successful", users: savedEmails });
  } catch (error) {
    console.error("Upload error:", error.message);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
});

// ======================= ROUTES =======================
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/follow', followRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', enrollmentsRoutes);
const emailRoutes = require('./routes/email');
app.use('/api', emailRoutes);

// ======================= ERROR HANDLER =======================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error' });
});

// ======================= SERVER START =======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
