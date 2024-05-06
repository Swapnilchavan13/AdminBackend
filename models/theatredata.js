const mongoose = require('mongoose');

const rowSchema = new mongoose.Schema({
  option: String,
  seats: Number,
});

const dataSchema = new mongoose.Schema({
  theatreId: Number,
  theatreName: String,
  theatreLocation: String,
  theatreCity: String,
  theatrePinCode: Number,
  theatreOperatorEmail: String,
  theatreOperatorContact: Number,
  theatreOperatorName: String,
  theatreOperatorIDproof: String,
  theaterScreens: Number,
  totalScreens: Number,
  seatingCapacity : Number,
  isDeleted: { type: Boolean, default: false }, // assuming it's a boolean field
  rows: [rowSchema],
});

const Theatredata = mongoose.model('Theatredata', dataSchema);

module.exports = Theatredata;
