const mongoose = require('mongoose');

const allocateDataSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true
  },
  theatreName: {
    type: String,
    required: true
  },
  movieData: {
    type: Object,
    required: true
  }
});

const Allocatedata = mongoose.model('Allocatedata', allocateDataSchema);

module.exports = Allocatedata;
