import dns from 'node:dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import eventRoutes from "./routes/eventRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

import Event from "./models/Events.js";

dotenv.config();

const app = express();

// ========================================
// MIDDLEWARE
// ========================================

const allowedOrigins = [
  "http://localhost:5173",
  "https://mern-eventhub.vercel.app"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

// ========================================
// BASIC TEST ROUTE
// ========================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "EventHub API is running",
  });
});

// ========================================
// EVENT API ROUTES
// ========================================

app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);

// ========================================
// PORT
// ========================================

const PORT = process.env.PORT || 5000;

// ========================================
// MONGODB + SERVER
// ========================================

const startServer = async () => {
  try {
    // Check MongoDB URI
    if (!process.env.MONGODB_URI) {
      throw new Error(
        "MONGODB_URI is missing. Check your server/.env file."
      );
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Connected to MongoDB");
 
    // Show the database Node.js is actually connected to
    console.log("Database:", mongoose.connection.name);

    // Check Event collection 
    const eventCount = await Event.countDocuments();

    console.log("Events in database:", eventCount);
    

    // Start server after MongoDB connection succeeds
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`API: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

startServer();