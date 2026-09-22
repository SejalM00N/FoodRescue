const mongoose = require("mongoose");

const volunteerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    location: {
      address: {
        type: String,
        required: true,
      },

      latitude: {
        type: Number,
        required: true,
      },

      longitude: {
        type: Number,
        required: true,
      },
    },

    vehicleType: {
      type: String,
      enum: ["bike", "car", "other"],
      default: "bike",
    },

    maxDistanceKm: {
      type: Number,
      default: 10,
      min: 1,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("VolunteerProfile", volunteerProfileSchema);
