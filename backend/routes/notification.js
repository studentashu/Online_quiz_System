// routes/notification.js

const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { authenticateToken } = require('../middleware/middleware');

// Create a notification (admin)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { message, visibleTo } = req.body;
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const notification = new Notification({
      message,
      createdBy: req.user.userId,
      visibleTo: visibleTo || [], // empty array means visible to all users
      readBy: []
    });

    await notification.save();
    res.status(201).json({ message: 'Notification created', notification });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create notification', error: error.message });
  }
});

// Get all notifications visible to the logged-in user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const notifications = await Notification.find({
      $or: [
        { visibleTo: { $exists: true, $size: 0 } }, 
        { visibleTo: userId }                       // or targeted to this user
      ]
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get notifications', error: err.message });
  }
});

// Mark a notification as read by the logged-in user
router.put('/:id/read', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Check if user is allowed to mark read
    if (
      notification.visibleTo.length > 0 &&
      !notification.visibleTo.some(id => id.equals(userId))
    ) {
      return res.status(403).json({ message: 'Not authorized to update this notification' });
    }

    if (!notification.readBy.some(id => id.equals(userId))) {
      notification.readBy.push(userId);
      await notification.save();
    }

    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update notification', error: err.message });
  }
});

// Delete a notification (admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Only creator (admin) can delete
    if (notification.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this notification' });
    }

    await notification.remove();
    res.json({ message: 'Notification deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete notification', error: err.message });
  }
});

module.exports = router;
