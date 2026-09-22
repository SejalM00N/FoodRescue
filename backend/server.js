const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const donationRoutes = require("./routes/donationRoutes");
const donationRequestRoutes = require("./routes/donationRequestRoutes");
const ngoProfileRoutes = require("./routes/ngoProfileRoutes");
const volunteerProfileRoutes = require("./routes/volunteerProfileRoutes");
const deliveryRoutes = require("./routes/deliveryRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/donation-requests", donationRequestRoutes);
app.use("/api/ngo-profile", ngoProfileRoutes);
app.use("/api/volunteer-profile", volunteerProfileRoutes);
app.use("/api/deliveries", deliveryRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "FoodRescue API is running",
  });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => {
    console.log("MongoDB connected successfully");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`FoodRescue server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });
