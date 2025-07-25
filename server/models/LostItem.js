const mongoose = require('mongoose');

const LostItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  dateLastSeen: { type: Date, required: true },
  placeLastSeen: { type: String, required: true },
  image: { type: String },
  id: { type: String, required: true, unique: true },
  status: { type: String, enum: ['Found by staff', 'Declared by client', 'Delivered'], default: 'Declared by client' },
  expiration: { type: String, enum: ['1 month', '1 year', 'unlimited'], default: 'unlimited' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LostItem', LostItemSchema); 