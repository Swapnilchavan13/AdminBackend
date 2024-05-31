// models/User.js
const mongoose = require('mongoose');


const Evn = new mongoose.Schema({
    eventName: String,
    eventDescription: String,
    eventCategory: String,
    pincode: String,
    city: String,
    eventAddress: String,
    startDate: Date,
    endDate: Date,
    eventTime: String,
    numberOfSeats: Number,
    pricePerSeat: Number,
  images: [String],
  video: String,
});


module.exports = mongoose.model('Evn', Evn);