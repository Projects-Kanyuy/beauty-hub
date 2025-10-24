// server/models/salonModel.js
const mongoose = require('mongoose');

// We define the schema for a service as a sub-document
const serviceSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  duration: { type: Number, required: true }, // in minutes
});

const salonSchema = mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId, // A special type for referencing another document
      required: true,
      ref: 'User', // This tells Mongoose the ObjectId refers to a document in the 'User' collection
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: { type: String, required: true },
    city: { type: String, required: true },
    phone: { type: String, required: true },
    photos: [{ type: String }], // An array of image URLs
    openingHours: {
      monday: String,
      tuesday: String,
      wednesday: String,
      thursday: String,
      friday: String,
      saturday: String,
      sunday: String,
    },
    services: [serviceSchema], // An array of services, each following the serviceSchema
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Salon = mongoose.model('Salon', salonSchema);

module.exports = Salon;