const mongoose = require('mongoose');

const FormSchema = new mongoose.Schema({
  title: { type: String, required: true },
  expiresAt: { type: Date },
  adminNote: { type: String },
  fields: [{
    label: { type: String, required: true },
    type: {
      type: String,
      enum: ['text', 'textarea', 'number', 'dropdown', 'date', 'multiselect'],
      required: true
    },
    options: { type: String },
    required: { type: Boolean, default: false }
  }],
  expiresAt: { type: Date},
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Form', FormSchema);