const mongoose = require('mongoose');

const cmsDataSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  images: [{
    type: String // URL or path to the image file
  }],
  title: {
    type: String,
    required: true
  },
  entryType: {
    type: String,
    enum: ['Paid', 'Free'],
    required: true
  },
  directionLink: {
    type: String,
    required: true
  },
  about: {
    type: String,
    required: true
  },
  timing: {
    type: String,
    // Optional field
  },
  contactNumber: {
    type: String,
    // Optional field
  },
  website: {
    type: String,
    // Optional field
  }
});

module.exports = mongoose.model('CmsData', cmsDataSchema);
