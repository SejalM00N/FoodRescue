const mongoose = require("mongoose");

const donationRequestSchema = new mongoose.Schema(
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

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },

    message: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

// Prevent the same NGO from requesting the same donation more than once
donationRequestSchema.index({ donation: 1, ngo: 1 }, { unique: true });

module.exports = mongoose.model("DonationRequest", donationRequestSchema);
