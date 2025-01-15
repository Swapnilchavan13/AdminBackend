const mongoose = require('mongoose');

const MerchantSchema = new mongoose.Schema({
  businessName: { type: String, required: true },
  ownerName: { type: String, required: true },
  businessType: { type: String, required: true },
  contactNumber: { type: String, required: true },
  email: { type: String, required: true },
  website: { type: String },
  address: { type: String, required: true },
  brandImage: { type: String}, // Array of image URLs or paths
});

module.exports = mongoose.model('Merchant', MerchantSchema);
