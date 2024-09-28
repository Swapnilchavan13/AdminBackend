const mongoose = require('mongoose');

const merchantDataSchema = new mongoose.Schema({
  businessName: String,
  businessType: String,
  businessAddress: String,
  contactEmail: String,
  contactPhoneNumber: String,
  websiteUrl: String,
  operationHours: String,
  yearsOfBusiness: String,
  numberOfEmployees: String,
  productDescription: String,
  preferredCategories: String,
  offerFrequency: String,
  specificRequirements: String,
  panTanNumber: String,
  gstin: String,
  bankAccountDetails: String,
  businessLicense: String,
  gstCertificate: String,
  panCard: String,
  proofOfAddress: String,
  profileImage: String,
  personName: String,
  lastName: String,
  password: String,
  numberOfPeople: String,
  brandLogo: String,
  membershipPlan: String
}, { timestamps: true });

module.exports = mongoose.model('MerchantData', merchantDataSchema);
