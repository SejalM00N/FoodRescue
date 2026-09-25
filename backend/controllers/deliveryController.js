const Delivery = require("../models/Delivery");
const DonationRequest = require("../models/DonationRequest");
const Donation = require("../models/Donation");

// Create a delivery after donor accepts a donation request
const createDelivery = async (req, res) => {
  try {
    const { requestId } = req.body;

    if (!requestId) {
      return res.status(400).json({
        message: "Request ID is required",
      });
    }

    const request = await DonationRequest.findById(requestId)
      .populate("donation")
      .populate("ngo", "name email");

    if (!request) {
      return res.status(404).json({
        message: "Donation request not found",
      });
    }

    if (!request.donation) {
      return res.status(404).json({
        message: "Associated donation not found",
      });
    }

    // Only the donor who owns the donation can create its delivery
    if (request.donation.donor.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can only create deliveries for your own donations",
      });
    }

    // Delivery can only be created for an accepted request
    if (request.status !== "accepted") {
      return res.status(400).json({
        message: "Donation request must be accepted first",
      });
    }

    // Donation must also be in the accepted state
    if (request.donation.status !== "accepted") {
      return res.status(400).json({
        message: "Donation is not ready for delivery",
      });
    }

    // Prevent duplicate deliveries
    const existingDelivery = await Delivery.findOne({
      donation: request.donation._id,
    });

    if (existingDelivery) {
      return res.status(400).json({
        message: "Delivery already exists for this donation",
      });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const delivery = await Delivery.create({
      donation: request.donation._id,
      ngo: request.ngo._id,
      otp,
    });

    res.status(201).json({
      message: "Delivery created successfully",
      delivery,
    });
  } catch (error) {
    console.error("Create delivery error:", error);

    res.status(500).json({
      message: "Failed to create delivery",
      error: error.message,
    });
  }
};

// Volunteer gets available pickup tasks
const getAvailableDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find({
      volunteer: null,
      pickupStatus: "pending",
      deliveryStatus: "pending",
    })
      .populate("donation")
      .populate("ngo", "name email")
      .sort({ createdAt: -1 });

    res.json({
      deliveries,
    });
  } catch (error) {
    console.error("Get available deliveries error:", error);

    res.status(500).json({
      message: "Failed to fetch available deliveries",
      error: error.message,
    });
  }
};

// Volunteer accepts a delivery
const acceptDelivery = async (req, res) => {
  try {
    const { deliveryId } = req.params;

    const delivery = await Delivery.findById(deliveryId).populate("donation");

    if (!delivery) {
      return res.status(404).json({
        message: "Delivery not found",
      });
    }

    if (!delivery.donation) {
      return res.status(404).json({
        message: "Associated donation not found",
      });
    }

    // Delivery must still be available
    if (delivery.pickupStatus !== "pending") {
      return res.status(400).json({
        message: "This delivery is no longer available",
      });
    }

    if (delivery.deliveryStatus !== "pending") {
      return res.status(400).json({
        message: "This delivery is no longer available for pickup",
      });
    }

    if (delivery.volunteer) {
      return res.status(400).json({
        message: "This delivery has already been assigned",
      });
    }

    // Make sure the donation is still accepted
    if (delivery.donation.status !== "accepted") {
      return res.status(400).json({
        message: "This donation is not ready for pickup",
      });
    }

    delivery.volunteer = req.user.id;
    delivery.pickupStatus = "accepted";

    await delivery.save();

    res.json({
      message: "Delivery accepted successfully",
      delivery,
    });
  } catch (error) {
    console.error("Accept delivery error:", error);

    res.status(500).json({
      message: "Failed to accept delivery",
      error: error.message,
    });
  }
};

// Volunteer marks food as picked up
const markPickedUp = async (req, res) => {
  try {
    const { deliveryId } = req.params;

    const delivery = await Delivery.findById(deliveryId);

    if (!delivery) {
      return res.status(404).json({
        message: "Delivery not found",
      });
    }

    // Only assigned volunteer can update this delivery
    if (delivery.volunteer?.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not assigned to this delivery",
      });
    }

    if (delivery.pickupStatus !== "accepted") {
      return res.status(400).json({
        message: "Delivery must be accepted before pickup",
      });
    }

    if (delivery.deliveryStatus !== "pending") {
      return res.status(400).json({
        message: "This delivery is no longer awaiting pickup",
      });
    }

    delivery.pickupStatus = "picked_up";
    delivery.deliveryStatus = "in_transit";

    const donation = await Donation.findById(delivery.donation);

    if (!donation) {
      return res.status(404).json({
        message: "Associated donation not found",
      });
    }

    if (donation.status !== "accepted") {
      return res.status(400).json({
        message: "Donation is not in an accepted state",
      });
    }

    donation.status = "in_transit";

    await donation.save();
    await delivery.save();

    res.json({
      message: "Food picked up successfully",
      delivery,
    });
  } catch (error) {
    console.error("Mark picked up error:", error);

    res.status(500).json({
      message: "Failed to update pickup status",
      error: error.message,
    });
  }
};

// Volunteer gets their assigned deliveries
const getMyDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find({
      volunteer: req.user.id,
    })
      .populate("donation")
      .populate("ngo", "name email")
      .sort({ createdAt: -1 });

    res.json({
      deliveries,
    });
  } catch (error) {
    console.error("Get my deliveries error:", error);

    res.status(500).json({
      message: "Failed to fetch your deliveries",
      error: error.message,
    });
  }
};

// NGO gets their deliveries
const getMyNGODeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find({
      ngo: req.user.id,
    })
      .populate("donation")
      .populate("volunteer", "name email")
      .sort({ createdAt: -1 });

    res.json({
      deliveries,
    });
  } catch (error) {
    console.error("Get NGO deliveries error:", error);

    res.status(500).json({
      message: "Failed to fetch NGO deliveries",
      error: error.message,
    });
  }
};

// Volunteer marks food as delivered
const markDelivered = async (req, res) => {
  try {
    const { deliveryId } = req.params;

    const delivery = await Delivery.findById(deliveryId);

    if (!delivery) {
      return res.status(404).json({
        message: "Delivery not found",
      });
    }

    // Only assigned volunteer can mark delivery
    if (delivery.volunteer?.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not assigned to this delivery",
      });
    }

    if (delivery.pickupStatus !== "picked_up") {
      return res.status(400).json({
        message: "Food must be picked up first",
      });
    }

    if (delivery.deliveryStatus !== "in_transit") {
      return res.status(400).json({
        message: "Delivery must be in transit first",
      });
    }

    delivery.deliveryStatus = "delivered";

    await delivery.save();

    res.json({
      message: "Food delivered successfully",
      delivery,
    });
  } catch (error) {
    console.error("Mark delivered error:", error);

    res.status(500).json({
      message: "Failed to mark delivery as delivered",
      error: error.message,
    });
  }
};

// NGO verifies delivery using OTP
const verifyDelivery = async (req, res) => {
  try {
    const { deliveryId } = req.params;
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({
        message: "OTP is required",
      });
    }

    const delivery = await Delivery.findById(deliveryId);

    if (!delivery) {
      return res.status(404).json({
        message: "Delivery not found",
      });
    }

    // Only the assigned NGO can verify
    if (delivery.ngo.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can only verify deliveries assigned to your NGO",
      });
    }

    if (delivery.deliveryStatus !== "delivered") {
      return res.status(400).json({
        message: "Delivery must be marked as delivered first",
      });
    }

    if (delivery.otpVerified) {
      return res.status(400).json({
        message: "This delivery has already been verified",
      });
    }

    if (delivery.otp !== String(otp)) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    delivery.otpVerified = true;
    delivery.deliveryStatus = "verified";

    const donation = await Donation.findById(delivery.donation);

    if (!donation) {
      return res.status(404).json({
        message: "Associated donation not found",
      });
    }

    if (donation.status !== "in_transit") {
      return res.status(400).json({
        message: "Donation is not in the correct delivery state",
      });
    }

    donation.status = "completed";

    await donation.save();
    await delivery.save();

    res.json({
      message: "Delivery verified successfully",
      delivery,
    });
  } catch (error) {
    console.error("Verify delivery error:", error);

    res.status(500).json({
      message: "Failed to verify delivery",
      error: error.message,
    });
  }
};

module.exports = {
  createDelivery,
  getAvailableDeliveries,
  acceptDelivery,
  markPickedUp,
  getMyDeliveries,
  getMyNGODeliveries,
  markDelivered,
  verifyDelivery,
};
