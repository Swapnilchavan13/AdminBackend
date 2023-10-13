const mongoose = require('mongoose');

const rowSchema = new mongoose.Schema({
  option: String,
  seats: Number,
});

const dataSchema = new mongoose.Schema({
  location: String,
  loginid: String,
  name: String,
  password: String,
  rows: [rowSchema],
});

const Theatredata = mongoose.model('Theatredata', dataSchema);

module.exports = Theatredata;
