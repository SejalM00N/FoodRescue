const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema(
  {
    donation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donation",
      required: true,
    },

    ngo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    deliveryFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    deliveryLocation: {
      address: {
        type: String,
        required: true,
        trim: true,
      },

      latitude: {
        type: Number,
        required: true,
        min: -90,
        max: 90,
      },

      longitude: {
        type: Number,
        required: true,
        min: -180,
        max: 180,
      },
    },

    volunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    pickupStatus: {
      type: String,
      enum: ["pending", "accepted", "picked_up"],
      default: "pending",
    },

    deliveryStatus: {
      type: String,
      enum: ["pending", "in_transit", "delivered", "verified"],
      default: "pending",
    },

    otp: {
      type: String,
      match: /^\d{6}$/,
    },

    otpVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Delivery", deliverySchema);
