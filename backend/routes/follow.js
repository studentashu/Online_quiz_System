const express = require('express');
const router = express.Router();
const Follow = require('../models/Follow');
const User = require('../models/User'); // Import User model
const { authenticateToken } = require('../middleware/middleware');

// Get logged-in user info
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('_id name email role');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user', error: err.message });
  }
});

// Follow a user
router.post('/', authenticateToken, async (req, res) => {
  try {
    const follower = req.user.userId; // from middleware
    const { following } = req.body;

    if (!following) {
      return res.status(400).json({ message: 'Following user ID is required' });
    }

    if (follower === following) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    const existingFollow = await Follow.findOne({ follower, following });
    if (existingFollow) {
      return res.status(400).json({ message: 'Already following this user' });
    }

    const follow = new Follow({ follower, following });
    await follow.save();

    res.status(201).json({ message: 'Followed successfully', follow });
  } catch (err) {
    res.status(500).json({ message: 'Failed to follow user', error: err.message });
  }
});

// Unfollow a user
router.delete('/:followingUserId', authenticateToken, async (req, res) => {
  try {
    const follower = req.user.userId;
    const following = req.params.followingUserId;

    const follow = await Follow.findOne({ follower, following });
    if (!follow) {
      return res.status(404).json({ message: 'You are not following this user' });
    }

    await Follow.deleteOne({ follower, following });

    res.json({ message: 'User unfollowed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to unfollow user', error: err.message });
  }
});

// Get followers of a user
router.get('/followers/:userId', async (req, res) => {
  try {
    const followers = await Follow.find({ following: req.params.userId }).populate('follower', 'name email');
    res.json(followers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get followers', error: err.message });
  }
});

// Get followings of a user
router.get('/following/:userId', async (req, res) => {
  try {
    const following = await Follow.find({ follower: req.params.userId }).populate('following', 'name email');
    res.json(following);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get following', error: err.message });
  }
});

module.exports = router;
