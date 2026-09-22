const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    foodName: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: [
        "cooked-meal",
        "bakery",
        "fruits",
        "vegetables",
        "packaged-food",
        "other",
      ],
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    unit: {
      type: String,
      enum: ["kg", "liters", "servings", "packets", "pieces"],
      required: true,
    },

    preparedAt: {
      type: Date,
      required: true,
    },

    pickupDeadline: {
      type: Date,
      required: true,
    },

    location: {
      address: {
        type: String,
        required: true,
      },
      latitude: {
        type: Number,
      },
      longitude: {
        type: Number,
      },
    },

    description: {
      type: String,
      trim: true,
    },

    imageUrl: {
      type: String,
    },

    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["available", "requested", "accepted", "in_transit", "completed"],
      default: "available",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Donation", donationSchema);
