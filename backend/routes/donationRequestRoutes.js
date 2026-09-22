const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  createRequest,
  getMyRequests,
  getDonationRequests,
  updateRequestStatus,
} = require("../controllers/donationRequestController");

const router = express.Router();

// NGO requests a donation
router.post("/", protect, authorizeRoles("ngo"), createRequest);

// NGO views its own requests
router.get("/my", protect, authorizeRoles("ngo"), getMyRequests);

// Donor views requests for their donations
router.get("/donor", protect, authorizeRoles("donor"), getDonationRequests);

// Donor accepts/rejects a request
router.put(
  "/:requestId",
  protect,
  authorizeRoles("donor"),
  updateRequestStatus,
);

module.exports = router;
