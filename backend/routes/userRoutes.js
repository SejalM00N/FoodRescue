const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  updateProfile,
  updateLocation,
  changePassword,
} = require("../controllers/userController");

const router = express.Router();

// Get logged-in user's profile

router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Profile fetched successfully",
    user: req.user,
  });
});

// Update profile

router.put("/profile", protect, updateProfile);

// Update location

router.put("/location", protect, updateLocation);

// Change password

router.put("/password", protect, changePassword);

module.exports = router;
