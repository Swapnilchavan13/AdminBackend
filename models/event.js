const mongoose = require('mongoose');

// Define the schema
const eventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true
  },
  eventDescription: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  pincode: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  eventTime: {
    type: String,
    required: true
  },
  numberOfSeats: {
    type: Number,
    required: true
  },
  pricePerSeat: {
    type: Number,
    required: true
  },
  images: [{
    name: String,
  }],
  video: {
    name: String
  }
});

// Create a model based on the schema
const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
