// models/Merchant.js
const mongoose = require('mongoose');

const merchantSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: true,
  },
  businessAddress: {
    type: String,
    required: true,
  },
  contactPerson: {
    type: String,
    required: true,
  },
  contactEmail: {
    type: String,
    required: true,
  },
  contactPhoneNumber: {
    type: String,
    required: true,
  },
  loginPin: {
    type: String,
    required: true,
    length: 4,
  },
});

module.exports = mongoose.model('Merchant', merchantSchema);
