const mongoose = require('mongoose');

const FormResponseSchema = new mongoose.Schema({
  formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
  formGuestId: { type: mongoose.Schema.Types.ObjectId, ref: 'FormGuest', required: true },
  answers: { type: mongoose.Schema.Types.Mixed, required: true },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FormResponse', FormResponseSchema);