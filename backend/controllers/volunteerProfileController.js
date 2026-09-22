const VolunteerProfile = require("../models/VolunteerProfile");

// Create or update volunteer profile
const createOrUpdateProfile = async (req, res) => {
  try {
    const { location, vehicleType, maxDistanceKm, isAvailable } = req.body;

    const profile = await VolunteerProfile.findOneAndUpdate(
      { user: req.user.id },
      {
        user: req.user.id,
        location,
        vehicleType,
        maxDistanceKm,
        isAvailable,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    );

    res.json({
      message: "Volunteer profile saved successfully",
      profile,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to save volunteer profile",
      error: error.message,
    });
  }
};

// Get logged-in volunteer profile
const getMyProfile = async (req, res) => {
  try {
    const profile = await VolunteerProfile.findOne({
      user: req.user.id,
    });

    if (!profile) {
      return res.status(404).json({
        message: "Volunteer profile not found",
      });
    }

    res.json({
      profile,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch volunteer profile",
      error: error.message,
    });
  }
};

module.exports = {
  createOrUpdateProfile,
  getMyProfile,
};
