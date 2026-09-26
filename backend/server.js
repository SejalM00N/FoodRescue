const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const donationRoutes = require("./routes/donationRoutes");
const donationRequestRoutes = require("./routes/donationRequestRoutes");
const ngoProfileRoutes = require("./routes/ngoProfileRoutes");
const volunteerProfileRoutes = require("./routes/volunteerProfileRoutes");
const deliveryRoutes = require("./routes/deliveryRoutes");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
const Delivery = require("./models/Delivery");
const Donation = require("./models/Donation");

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("authenticate", (token) => {
    try {
      if (!token) {
        socket.emit("socket-auth-error", {
          message: "Authentication token is required.",
        });
        return;
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      socket.data.userId = decoded.id;

      socket.emit("socket-authenticated");

      console.log(`Socket authenticated for user ${decoded.id}`);
    } catch (error) {
      console.error("Socket authentication failed:", error.message);

      socket.emit("socket-auth-error", {
        message: "Invalid or expired authentication token.",
      });

      socket.disconnect();
    }
  });

  socket.on("join-delivery", async (deliveryId) => {
    try {
      const userId = socket.data.userId;

      if (!userId) {
        socket.emit("delivery-access-denied", {
          message: "Socket authentication required.",
        });
        return;
      }

      if (!deliveryId) {
        socket.emit("delivery-access-denied", {
          message: "Delivery ID is required.",
        });
        return;
      }

      const delivery = await Delivery.findById(deliveryId);

      if (!delivery) {
        socket.emit("delivery-access-denied", {
          message: "Delivery not found.",
        });
        return;
      }

      const donation = await Donation.findById(delivery.donation);

      if (!donation) {
        socket.emit("delivery-access-denied", {
          message: "Associated donation not found.",
        });
        return;
      }

      const isVolunteer = delivery.volunteer?.toString() === userId;

      const isNgo = delivery.ngo?.toString() === userId;

      const isDonor = donation.donor?.toString() === userId;

      if (!isVolunteer && !isNgo && !isDonor) {
        socket.emit("delivery-access-denied", {
          message: "You are not a participant in this delivery.",
        });
        return;
      }

      socket.data.deliveryId = deliveryId;
      socket.data.isVolunteer = isVolunteer;

      socket.join(`delivery-${deliveryId}`);

      console.log(`User ${userId} joined delivery-${deliveryId}`);

      socket.emit("delivery-access-granted", {
        deliveryId,
      });
    } catch (error) {
      console.error("Socket delivery access error:", error);

      socket.emit("delivery-access-denied", {
        message: "Could not verify delivery access.",
      });
    }
  });

  socket.on("volunteer-location", ({ deliveryId, latitude, longitude }) => {
    console.log("LOCATION EVENT ARRIVED:", {
      deliveryId,
      latitude,
      longitude,
    });
    try {
      if (!deliveryId || latitude == null || longitude == null) {
        return;
      }

      if (socket.data.deliveryId !== deliveryId) {
        return;
      }

      if (!socket.data.isVolunteer) {
        return;
      }
      console.log(
        "VOLUNTEER LOCATION RECEIVED:",
        deliveryId,
        latitude,
        longitude,
      );
      socket.to(`delivery-${deliveryId}`).emit("volunteer-location", {
        latitude,
        longitude,
      });
    } catch (error) {
      console.error("Volunteer location socket error:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});
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

    server.listen(PORT, () => {
      console.log(`FoodRescue server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });
