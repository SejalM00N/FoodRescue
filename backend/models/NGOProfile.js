const mongoose = require("mongoose");

const ngoProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    neededCategories: {
      type: [String],
      enum: [
        "cooked-meal",
        "bakery",
        "fruits",
        "vegetables",
        "packaged-food",
        "other",
      ],
      default: [],
    },

    dailyCapacity: {
      type: Number,
      required: true,
      min: 1,
    },

    currentNeed: {
      type: Number,
      default: 0,
      min: 0,
    },

    preferredPickupStart: {
      type: String,
      default: "10:00",
    },

    preferredPickupEnd: {
      type: String,
      default: "20:00",
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

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("NGOProfile", ngoProfileSchema);
