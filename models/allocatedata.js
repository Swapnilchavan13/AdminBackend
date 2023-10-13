const mongoose = require('mongoose');

const showtimeSchema = new mongoose.Schema({
  time: String,
  available: Boolean,
});

const movieSchema = new mongoose.Schema({
  name: String,
  showTimes: [showtimeSchema],
});

const allocateDataSchema = new mongoose.Schema({
  date: String,
  movieData: [movieSchema],
  theatreName: String,
});

const Allocatedata = mongoose.model('Allocatedata', allocateDataSchema);

module.exports = Allocatedata;
