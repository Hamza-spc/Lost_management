const mongoose = require('mongoose');

const LostItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  dateLastSeen: { type: Date, required: true },
  placeLastSeen: { type: String, required: true },
  image: { type: String },
  id: { type: String, required: true, unique: true },
  status: { type: String, enum: ['Lost', 'Found', 'Returned'], default: 'Lost' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LostItem', LostItemSchema); 