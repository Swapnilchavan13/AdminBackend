const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  title: { type: String, required: true },
  likes: { type: Number, default: 0 },
  description: { type: String, required: true },
  prize: { type: String, required: true },
  winners: { type: Number, required: true },
  images: [String], // Array to store image filenames
  category: { type: String, required: true },
  entryFees: { type: String, required: true },
  numberOfEntries: { type: Number, required: true },
  organizerName: { type: String, required: true },
  logo: { type: String }, // Single logo filename
  startDate: { type: Date, required: true }, // Add startDate field
  endDate: { type: Date, required: true }, // Add endDate field
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Game', gameSchema);
