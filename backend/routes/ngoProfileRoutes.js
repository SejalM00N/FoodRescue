const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  createOrUpdateProfile,
  getMyProfile,
} = require("../controllers/ngoProfileController");

const router = express.Router();

// Create or update NGO profile
router.put("/", protect, authorizeRoles("ngo"), createOrUpdateProfile);

// Get logged-in NGO profile
router.get("/", protect, authorizeRoles("ngo"), getMyProfile);

module.exports = router;
