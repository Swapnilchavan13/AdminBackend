const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    theatreId: String,
    screenId: String,
    theatreName: String,
    movieName: String,
    showDate: String,
    showTime: String,
    seats: [String],
  });
  
  // Create a model based on the schema
  const Bookingdata = mongoose.model('Bookingdata', bookingSchema);

  module.exports = Bookingdata;
