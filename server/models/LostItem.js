const mongoose = require('mongoose');

const LostItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  dateLastSeen: { type: Date, required: true },
  placeLastSeen: { type: String, required: true },
  email: { type: String },
  clientEmail: { type: String }, // For client authentication
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' }, // Reference to client
  image: { type: String },
  id: { type: String, required: true, unique: true },
  status: { 
    type: String, 
    enum: ['Found by staff', 'Declared by client', 'Delivered', 'Pickup requested', 'Delivery requested'], 
    default: 'Declared by client' 
  },
  expiration: { type: String, enum: ['1 month', '1 year', 'unlimited'], default: 'unlimited' },
  createdAt: { type: Date, default: Date.now },
  // Pickup fields
  pickupRequested: { type: Boolean, default: false },
  pickupRequestedAt: { type: Date },
  // Delivery fields
  deliveryRequested: { type: Boolean, default: false },
  deliveryRequestedAt: { type: Date },
  deliveryAddress: { type: String },
  deliveryPhone: { type: String },
  deliveryCity: { type: String },
  deliveryPostalCode: { type: String },
  deliveryPaid: { type: Boolean, default: false }
});

module.exports = mongoose.model('LostItem', LostItemSchema); 