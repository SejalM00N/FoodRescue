const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  createDonation,
  getMyDonations,
  getAvailableDonations,
} = require("../controllers/donationController");

const router = express.Router();

// Donor creates a donation
router.post(
  "/",
  protect,
  authorizeRoles("donor"),
  upload.single("image"),
  createDonation,
);

// Donor gets their own donations
router.get("/my", protect, authorizeRoles("donor"), getMyDonations);

// NGO gets available donations
router.get("/available", protect, authorizeRoles("ngo"), getAvailableDonations);

module.exports = router;
