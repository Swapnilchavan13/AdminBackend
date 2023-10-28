const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customerMobile: String,
  customerName: String,
  gender: String,
  paymentMethod: String,
    tname: String,
    mname: String,
    sdate: String,
    showtime: String,
    seats: [String],
  });
  
  // Create a model based on the schema
  const Bookingdata = mongoose.model('Bookingdata', bookingSchema);

  module.exports = Bookingdata;
