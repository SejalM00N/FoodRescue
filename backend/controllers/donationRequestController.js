const DonationRequest = require("../models/DonationRequest");
const Donation = require("../models/Donation");

// NGO requests a donation
const createRequest = async (req, res) => {
  try {
    const { donationId, message } = req.body;

    const donation = await Donation.findById(donationId);

    if (!donation) {
      return res.status(404).json({
        message: "Donation not found",
      });
    }

    if (donation.status !== "available") {
      return res.status(400).json({
        message: "This donation is no longer available",
      });
    }

    const existingRequest = await DonationRequest.findOne({
      donation: donationId,
      ngo: req.user.id,
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "You have already requested this donation",
      });
    }

    const request = await DonationRequest.create({
      donation: donationId,
      ngo: req.user.id,
      message,
    });

    donation.status = "requested";
    await donation.save();

    res.status(201).json({
      message: "Donation request created successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create donation request",
      error: error.message,
    });
  }
};

// NGO gets its requests
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

    const request =
      await DonationRequest.findById(requestId).populate("donation");

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    if (request.donation.donor.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can only manage requests for your own donations",
      });
    }

    request.status = status;
    await request.save();

    if (status === "accepted") {
      request.donation.status = "accepted";
      await request.donation.save();
    }

    if (status === "rejected") {
      request.donation.status = "available";
      await request.donation.save();
    }

    res.json({
      message: `Request ${status} successfully`,
      request,
    });
  } catch (error) {
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
