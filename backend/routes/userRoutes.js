const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

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

// Donor-only test route
router.get("/donor-test", protect, authorizeRoles("donor"), (req, res) => {
  res.json({
    message: "Donor access granted!",
    user: req.user,
  });
});

module.exports = router;
