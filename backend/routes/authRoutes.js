const express = require("express");

const {
  register,
  login,
  updateRole,
  resetPassword,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.put("/role", protect, updateRole);

// Development-only password reset
router.post("/reset-password", resetPassword);

module.exports = router;
