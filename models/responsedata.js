const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  name: String,
  mobile: Number,
  email: String,
  questionType: String,
  comment: String
});

  // Create a model based on the schema
  const Responsedata = mongoose.model('Responsedata', responseSchema);

  module.exports = Responsedata;
