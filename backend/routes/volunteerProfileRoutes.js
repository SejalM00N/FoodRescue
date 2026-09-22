const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  createOrUpdateProfile,
  getMyProfile,
} = require("../controllers/volunteerProfileController");

const router = express.Router();

// Create or update volunteer profile
router.put("/", protect, authorizeRoles("volunteer"), createOrUpdateProfile);

// Get logged-in volunteer profile
router.get("/", protect, authorizeRoles("volunteer"), getMyProfile);

module.exports = router;
