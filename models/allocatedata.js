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
    type: Number,
    required: true
  },
  theatreName: {
    type: String,
    required: true
  },
  selectedscreen: {
    type: Number,
    required: true
  },
  movieData: {
    type: Object,
    required: true
  },
  photo: {
    type: [String],
    required: true
  },
  isActive: { 
    type: Boolean, 
    default: false 
  },
  city: String,
  description: String,
  startDate: Date,
  endDate: Date,
  startDate_EP: Date,
  endDate_EP: Date,
  category: String,
  totalLikes: Number,
  totalComments: Number,
  likedBy: [{
    email: String,
    firstName: String,
    lastName: String
  }],
  screenID: Number,// Corrected to match the schema
  matchId: String
});


const Allocatedata = mongoose.model('Allocatedata', allocateDataSchema);

module.exports = Allocatedata;
