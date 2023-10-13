const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  moviename: String,
  poster: String,
  description: String,
});

const Moviedata = mongoose.model('Moviedata', dataSchema);

module.exports = Moviedata;
