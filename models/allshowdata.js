const mongoose = require('mongoose');

const AllshowSchema = new mongoose.Schema({
  theaterID: Number,
  title: String,
  description: String,
  slots: [{
    slotID: String,
    startHour: Number,
    startMinutes: Number,
    endHour: Number,
    endMinutes: Number
  }],
  startDate: Date,
  endDate: Date,
  startDate_EP: Date,
  endDate_EP: Date,
  isActive: { type: Boolean, default: false },
  category: String,
  photos: [String],
  totalLikes: Number,
  totalComments: Number,
  likedBy: [{
    email: String,
    firstName: String,
    lastName: String
  }],
  screenID: String
});

const Allshowdata = mongoose.model('Allshowdata', AllshowSchema);

module.exports = Allshowdata;
