const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Update profile
const updateProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        message: "Name, email, and phone are required",
      });
    }

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({
        message: "Phone number must contain exactly 10 digits",
      });
    }

    const existingUser = await User.findOne({
      email,
      _id: { $ne: req.user.id },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email is already in use",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.name = name.trim();
    user.email = email.trim().toLowerCase();
    user.phone = phone;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        role: user.role,
        location: user.location || "",
        latitude: user.latitude,
        longitude: user.longitude,
        locationAccuracy: user.locationAccuracy,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

// Update location
const updateLocation = async (req, res) => {
  try {
    const { location, latitude, longitude, locationAccuracy } = req.body;

    if (!location || !location.trim()) {
      return res.status(400).json({
        message: "Location is required",
      });
    }

    if (typeof latitude !== "number" || typeof longitude !== "number") {
      return res.status(400).json({
        message: "Latitude and longitude are required",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.location = location.trim();
    user.latitude = latitude;
    user.longitude = longitude;
    user.locationAccuracy =
      typeof locationAccuracy === "number" ? locationAccuracy : null;

    await user.save();

    res.json({
      message: "Location updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        role: user.role,
        location: user.location,
        latitude: user.latitude,
        longitude: user.longitude,
        locationAccuracy: user.locationAccuracy,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update location",
      error: error.message,
    });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const passwordMatches = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!passwordMatches) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    res.json({
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to change password",
      error: error.message,
    });
  }
};

module.exports = {
  updateProfile,
  updateLocation,
  changePassword,
};
