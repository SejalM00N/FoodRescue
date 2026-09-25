const DonationRequest = require("../models/DonationRequest");
const Donation = require("../models/Donation");
const Delivery = require("../models/Delivery");

// NGO requests a donation
const createRequest = async (req, res) => {
  try {
    const { donationId, message } = req.body;

    if (!donationId) {
      return res.status(400).json({
        message: "Donation ID is required",
      });
    }

    const donation = await Donation.findById(donationId);

    if (!donation) {
      return res.status(404).json({
        message: "Donation not found",
      });
    }
    // Prevent NGO from requesting its own donation
    if (donation.donor.toString() === req.user.id) {
      return res.status(403).json({
        message: "You cannot request your own donation",
      });
    }

    // Donation must be available
    if (donation.status !== "available") {
      return res.status(400).json({
        message: "This donation is no longer available",
      });
    }

    // Check pickup deadline
    if (
      donation.pickupDeadline &&
      new Date(donation.pickupDeadline) <= new Date()
    ) {
      donation.status = "expired";
      await donation.save();

      return res.status(400).json({
        message: "This donation has expired",
      });
    }

    // Prevent duplicate request from the same NGO
    const existingRequest = await DonationRequest.findOne({
      donation: donationId,
      ngo: req.user.id,
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "You have already requested this donation",
      });
    }

    // Create NGO request
    const request = await DonationRequest.create({
      donation: donationId,
      ngo: req.user.id,
      message,
    });

    // Reserve the donation while donor reviews the request
    donation.status = "requested";
    await donation.save();

    res.status(201).json({
      message: "Donation request created successfully",
      request,
    });
  } catch (error) {
    console.error("Create donation request error:", error);

    res.status(500).json({
      message: "Failed to create donation request",
      error: error.message,
    });
  }
};

// NGO gets its own requests
const getMyRequests = async (req, res) => {
  try {
    const requests = await DonationRequest.find({
      ngo: req.user.id,
    })
      .populate("donation")
      .sort({ createdAt: -1 });

    res.json({
      requests,
    });
  } catch (error) {
    console.error("Get NGO requests error:", error);

    res.status(500).json({
      message: "Failed to fetch requests",
      error: error.message,
    });
  }
};

// Donor gets requests for their donations
const getDonationRequests = async (req, res) => {
  try {
    const donations = await Donation.find({
      donor: req.user.id,
    }).select("_id");

    const donationIds = donations.map((donation) => donation._id);

    const requests = await DonationRequest.find({
      donation: { $in: donationIds },
    })
      .populate("donation")
      .populate("ngo", "name email")
      .sort({ createdAt: -1 });

    res.json({
      requests,
    });
  } catch (error) {
    console.error("Get donor donation requests error:", error);

    res.status(500).json({
      message: "Failed to fetch donation requests",
      error: error.message,
    });
  }
};

// Donor accepts or rejects a request
const updateRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const request = await DonationRequest.findById(requestId)
      .populate("donation")
      .populate("ngo", "name email");

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    if (!request.donation) {
      return res.status(404).json({
        message: "Associated donation not found",
      });
    }

    // Only the owner of the donation can manage this request
    if (request.donation.donor.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can only manage requests for your own donations",
      });
    }

    // Prevent processing an already processed request
    if (request.status !== "pending") {
      return res.status(400).json({
        message: "This request has already been processed",
      });
    }

    // --------------------------------------------------
    // REJECT REQUEST
    // --------------------------------------------------

    if (status === "rejected") {
      request.status = "rejected";
      await request.save();

      request.donation.status = "available";
      await request.donation.save();

      return res.json({
        message: "Request rejected successfully",
        request,
      });
    }

    // --------------------------------------------------
    // ACCEPT REQUEST
    // --------------------------------------------------

    // Donation must still be requested
    if (request.donation.status !== "requested") {
      return res.status(400).json({
        message: "This donation is no longer awaiting approval",
      });
    }

    // Make sure the donation deadline hasn't passed
    if (
      request.donation.pickupDeadline &&
      new Date(request.donation.pickupDeadline) <= new Date()
    ) {
      request.donation.status = "expired";
      await request.donation.save();

      return res.status(400).json({
        message: "This donation has expired",
      });
    }

    // Make sure a delivery doesn't already exist
    const existingDelivery = await Delivery.findOne({
      donation: request.donation._id,
    });

    if (existingDelivery) {
      return res.status(400).json({
        message: "A delivery already exists for this donation",
      });
    }

    // Generate 6-digit verification OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Update request
    request.status = "accepted";
    await request.save();

    // Update donation
    request.donation.status = "accepted";
    await request.donation.save();

    // Create delivery automatically
    const delivery = await Delivery.create({
      donation: request.donation._id,
      ngo: request.ngo._id,
      otp,
    });

    return res.json({
      message: "Request accepted and delivery created successfully",
      request,
      delivery,
      otp,
    });
  } catch (error) {
    console.error("Update donation request error:", error);

    res.status(500).json({
      message: "Failed to update request",
      error: error.message,
    });
  }
};

module.exports = {
  createRequest,
  getMyRequests,
  getDonationRequests,
  updateRequestStatus,
};
