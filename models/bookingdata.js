const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: Number,
  cardId: Number,
  theatreId: Number,
  screenId: Number,
  theatreName: String,
  movieName: String,
  showDate: String,
  showTime: String,
  isCancel: {
      type: Boolean,
      default: false // Default value for isCancel field
  },
  seats: [String],
});

  // Create a model based on the schema
  const Bookingdata = mongoose.model('Bookingdata', bookingSchema);

  module.exports = Bookingdata;
