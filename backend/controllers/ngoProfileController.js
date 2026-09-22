const NGOProfile = require("../models/NGOProfile");

// Create or update NGO profile
const createOrUpdateProfile = async (req, res) => {
  try {
    const {
      neededCategories,
      dailyCapacity,
      currentNeed,
      preferredPickupStart,
      preferredPickupEnd,
      location,
      isAvailable,
    } = req.body;

    const profile = await NGOProfile.findOneAndUpdate(
      { user: req.user.id },
      {
        user: req.user.id,
        neededCategories,
        dailyCapacity,
        currentNeed,
        preferredPickupStart,
        preferredPickupEnd,
        location,
        isAvailable,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    );

    res.json({
      message: "NGO profile saved successfully",
      profile,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to save NGO profile",
      error: error.message,
    });
  }
};

// Get logged-in NGO profile
const getMyProfile = async (req, res) => {
  try {
    const profile = await NGOProfile.findOne({
      user: req.user.id,
    });

    if (!profile) {
      return res.status(404).json({
        message: "NGO profile not found",
      });
    }

    res.json({
      profile,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch NGO profile",
      error: error.message,
    });
  }
};

module.exports = {
  createOrUpdateProfile,
  getMyProfile,
};
