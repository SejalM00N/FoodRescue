const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  createDelivery,
  getAvailableDeliveries,
  acceptDelivery,
  markPickedUp,
  getMyDeliveries,
  getMyNGODeliveries,
  markDelivered,
  verifyDelivery,
} = require("../controllers/deliveryController");

const router = express.Router();

// Donor creates a delivery after accepting an NGO request
router.post("/", protect, authorizeRoles("donor"), createDelivery);

// Volunteer views available pickup tasks
router.get(
  "/available",
  protect,
  authorizeRoles("volunteer"),
  getAvailableDeliveries,
);

// Volunteer accepts a delivery
router.put(
  "/:deliveryId/accept",
  protect,
  authorizeRoles("volunteer"),
  acceptDelivery,
);

// Volunteer marks food as picked up
router.put(
  "/:deliveryId/pickup",
  protect,
  authorizeRoles("volunteer"),
  markPickedUp,
);

// Volunteer views their deliveries
router.get("/my", protect, authorizeRoles("volunteer"), getMyDeliveries);

// NGO views their deliveries
router.get("/ngo", protect, authorizeRoles("ngo"), getMyNGODeliveries);

// Volunteer marks delivery as completed
router.put(
  "/:deliveryId/delivered",
  protect,
  authorizeRoles("volunteer"),
  markDelivered,
);

// NGO verifies delivery using OTP
router.put(
  "/:deliveryId/verify",
  protect,
  authorizeRoles("ngo"),
  verifyDelivery,
);

module.exports = router;
