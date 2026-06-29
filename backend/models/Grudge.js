const mongoose = require('mongoose');

const grudgeSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isResolved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Grudge', grudgeSchema);