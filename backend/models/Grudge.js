const mongoose = require('mongoose');

const grudgeSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isResolved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  userId: { type: String, required: true },
});

module.exports = mongoose.model('Grudge', grudgeSchema);
