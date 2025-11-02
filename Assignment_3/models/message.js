// models/Message.js
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: { type: String, required: true, index: true },
  receiver: { type: String, required: true, index: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Message || mongoose.model('Message', MessageSchema);
