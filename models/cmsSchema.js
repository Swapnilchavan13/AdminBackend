const mongoose = require('mongoose');

// Define the schema for CMS data
const cmsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String, // Store the file paths or base64-encoded strings of images
      },
    ],
    videos: [
      {
        type: String, // Store the URLs of the videos
      },
    ],
    detailedText: {
      type: String, // New field for detailed text
      required: false,
    },
    files: [
      {
        type: String, // Store the file paths of various file types (PDFs, PPTs, Excel)
      },
    ],
    subCategory: {
      type: String,
      required: false,
    },
    category: {
      type: String,
      enum: ['Knowledge Portal', 'Paid Tools', 'Reports', 'Marketplace'], // Enumerate the possible categories
      required: true,
    },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

// Create the model from the schema
const CmsSchema = mongoose.model('CmsSchema', cmsSchema);

module.exports = CmsSchema;
