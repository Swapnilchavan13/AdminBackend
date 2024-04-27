const mongoose = require('mongoose');

const rowSchema = new mongoose.Schema({
  option: String,
  seats: Number,
});

const dataSchema = new mongoose.Schema({
  theatreId:Number,
  theatreName: String,
  theatreLocation: String,
  theatreCity: String,
  theatrePinCode: String,
  theatreOperatorEmail: String,
  theatreOperatorContact: String,
  theatreOperatorName: String,
  theatreOperatorIDproof: String,
  theaterScreens: Number,
  isDeleted: { type: Boolean, default: false }, // assuming it's a boolean field
  rows: [rowSchema],
});

const Theatredata = mongoose.model('Theatredata', dataSchema);

module.exports = Theatredata;
