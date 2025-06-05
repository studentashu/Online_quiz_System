const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  visibleTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // If empty, means visible to all users
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who read the notification
  createdAt: { type: Date, default: Date.now },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]

  
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);
