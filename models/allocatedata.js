const mongoose = require('mongoose');

const allocateDataSchema = new mongoose.Schema({
  admin: {
    type: String
  },
  date: {
    type: String,
    required: true
  },
 
  theatreId: {
    type: String,
    required: true
  },

  theatreName: {
    type: String,
    required: true
  },

  selectedscreen: {
    type: String,
    required: true
  },

  movieData: {
    type: Object,
    required: true
  }
});

// Add unique index to prevent duplicates
allocateDataSchema.index({ date: 1, theatreName: 1 }, { unique: true });

const Allocatedata = mongoose.model('Allocatedata', allocateDataSchema);

module.exports = Allocatedata;
