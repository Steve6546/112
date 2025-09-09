const express = require('express');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const { generateUserKeys, generateSessionId, generateNetworkKey } = require('../utils/crypto');

const router = express.Router();

// Register with dynamic session ID
router.post('/register', async (req, res) => {
  try {
    const { username } = req.body;
    const id = uuidv4();
    const sessionId = generateSessionId();
    const networkKey = generateNetworkKey();
    const { publicKey } = generateUserKeys();

    const user = new User({
      id,
      username,
      publicKey,
      sessionId,
      networkKey: networkKey.toString('hex'),
      lastLogin: new Date()
    });
    await user.save();

    res.json({
      id,
      username,
      publicKey,
      sessionId,
      networkKey: networkKey.toString('hex')
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login with new session ID each time
router.post('/login', async (req, res) => {
  try {
    const { id } = req.body;
    const user = await User.findOne({ id });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Generate new session ID for this login
    const newSessionId = generateSessionId();
    const newNetworkKey = generateNetworkKey();

    // Update user with new session data
    user.sessionId = newSessionId;
    user.networkKey = newNetworkKey.toString('hex');
    user.lastLogin = new Date();
    await user.save();

    res.json({
      id: user.id,
      username: user.username,
      publicKey: user.publicKey,
      sessionId: newSessionId,
      networkKey: newNetworkKey.toString('hex')
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user by id (for searching)
router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id });
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      id: user.id,
      username: user.username,
      publicKey: user.publicKey,
      sessionId: user.sessionId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users (for admin/supervisor)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, { networkKey: 0 }); // Exclude network keys for security
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user session
router.post('/update-session/:id', async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id });
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.sessionId = generateSessionId();
    user.networkKey = generateNetworkKey().toString('hex');
    await user.save();

    res.json({ sessionId: user.sessionId, networkKey: user.networkKey });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;