const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  movieName: String,
  movieDesc: String,
  movieRuntime: String,
  intervalTime: String,
  productionHouse: String,
  dateTime: Date,
  startDate: Date,
  endDate: Date,
  posterImage: String,
  extraImages: [{ type: String }], // Array to store extra images
  isDeleted: { type: Boolean, default: false },
  isExpired: { type: Boolean, default: false }
});

const Moviedata = mongoose.model('Moviedata', dataSchema);

module.exports = Moviedata;
