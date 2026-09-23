const Donation = require("../models/Donation");
const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "foodrescue/donations",
        resource_type: "image",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );

    uploadStream.end(buffer);
  });
};

const expireOverdueDonations = async (filter = {}) => {
  await Donation.updateMany(
    {
      ...filter,
      status: { $in: ["available", "requested"] },
      pickupDeadline: { $lte: new Date() },
    },
    {
      $set: {
        status: "expired",
      },
    },
  );
};

const createDonation = async (req, res) => {
  try {
    const {
      foodName,
      category,
      quantity,
      unit,
      preparedAt,
      pickupDeadline,
      location,
      description,
    } = req.body;

    let imageUrl = "";

    if (req.file) {
      const uploadedImage = await uploadToCloudinary(req.file.buffer);
      imageUrl = uploadedImage.secure_url;
    }

    const donation = await Donation.create({
      foodName,
      category,
      quantity,
      unit,
      preparedAt,
      pickupDeadline,
      location: typeof location === "string" ? JSON.parse(location) : location,
      description,
      imageUrl,
      donor: req.user.id,
    });

    res.status(201).json({
      message: "Donation created successfully",
      donation,
    });
  } catch (error) {
    console.error("Create donation error:", error);

    res.status(500).json({
      message: "Failed to create donation",
      error: error.message,
    });
  }
};

const getMyDonations = async (req, res) => {
  try {
    await expireOverdueDonations({
      donor: req.user.id,
    });

    const donations = await Donation.find({
      donor: req.user.id,
    }).sort({ createdAt: -1 });

    res.json({ donations });
  } catch (error) {
    console.error("Get my donations error:", error);

    res.status(500).json({
      message: "Failed to fetch donations",
      error: error.message,
    });
  }
};

const getAvailableDonations = async (req, res) => {
  try {
    await expireOverdueDonations();

    const donations = await Donation.find({
      status: "available",
      pickupDeadline: { $gt: new Date() },
    })
      .populate("donor", "name")
      .sort({ createdAt: -1 });

    res.json({ donations });
  } catch (error) {
    console.error("Get available donations error:", error);

    res.status(500).json({
      message: "Failed to fetch available donations",
      error: error.message,
    });
  }
};

module.exports = {
  createDonation,
  getMyDonations,
  getAvailableDonations,
};
