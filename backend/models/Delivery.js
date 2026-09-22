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
