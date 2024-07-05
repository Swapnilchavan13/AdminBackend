const mongoose = require('mongoose');

const responceSchema = new mongoose.Schema({
  name: String,
  mobile: Number,
  email: String,
  questionType: String,
  comment: String
});

  // Create a model based on the schema
  const Responcedata = mongoose.model('Responcedata', responceSchema);

  module.exports = Responcedata;
