const Delivery = require("../models/Delivery");
const DonationRequest = require("../models/DonationRequest");
const Donation = require("../models/Donation");

// Create a delivery after donor accepts a donation request
const createDelivery = async (req, res) => {
  try {
    const { requestId } = req.body;

    const request = await DonationRequest.findById(requestId)
      .populate("donation")
      .populate("ngo");

    if (!request) {
      return res.status(404).json({
        message: "Donation request not found",
      });
    }

    if (request.status !== "accepted") {
      return res.status(400).json({
        message: "Donation request must be accepted first",
      });
    }

    const existingDelivery = await Delivery.findOne({
      donation: request.donation._id,
    });

    if (existingDelivery) {
      return res.status(400).json({
        message: "Delivery already exists for this donation",
      });
    }

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

    const delivery = await Delivery.findById(deliveryId);

    if (!delivery) {
      return res.status(404).json({
        message: "Delivery not found",
      });
    }

    if (delivery.volunteer) {
      return res.status(400).json({
        message: "This delivery has already been assigned",
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

    if (delivery.volunteer?.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not assigned to this delivery",
      });
    }

    delivery.pickupStatus = "picked_up";
    delivery.deliveryStatus = "in_transit";

    const donation = await Donation.findById(delivery.donation);

    if (donation) {
      donation.status = "in_transit";
      await donation.save();
    }

    await delivery.save();

    res.json({
      message: "Food picked up successfully",
      delivery,
    });
  } catch (error) {
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

    if (delivery.volunteer?.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not assigned to this delivery",
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

    const delivery = await Delivery.findById(deliveryId);

    if (!delivery) {
      return res.status(404).json({
        message: "Delivery not found",
      });
    }

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

    if (delivery.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    delivery.otpVerified = true;
    delivery.deliveryStatus = "verified";

    const donation = await Donation.findById(delivery.donation);

    if (donation) {
      donation.status = "completed";
      await donation.save();
    }

    await delivery.save();

    res.json({
      message: "Delivery verified successfully",
      delivery,
    });
  } catch (error) {
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
