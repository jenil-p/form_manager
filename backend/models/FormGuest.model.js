const mongoose = require('mongoose');

const FormGuestSchema = new mongoose.Schema({
  formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
  guestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Guest', required: true },
  token: { type: String, unique: true, required: true },
  isSubmitted: { type: Boolean, default: false }, // Crucial for duplicate prevention
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FormGuest', FormGuestSchema);