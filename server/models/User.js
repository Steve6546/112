const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  username: { type: String, required: true },
  publicKey: { type: String, required: true },
  sessionId: { type: String, required: true }, // Dynamic session ID
  networkKey: { type: String, required: true }, // For double encryption
  lastLogin: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  messageCount: { type: Number, default: 0 },
  connections: [{ type: String }], // Array of connected user IDs
});

module.exports = mongoose.model('User', userSchema);