// api/index.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

dotenv.config();

const app = express();

// -----------------------
// Vercel-friendly CORS
// -----------------------
app.use((req, res, next) => {
  const allowedOrigins = [
    "https://bespoke-dieffenbachia-d8a8f5.netlify.app",
    "http://localhost:5500",
    "http://127.0.0.1:5500"
  ];

  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Handle preflight OPTIONS requests
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  next();
});

// -----------------------
// Body parser
// -----------------------
app.use(bodyParser.json());

// -----------------------
// MongoDB Connection
// -----------------------
if (!mongoose.connection.readyState) {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));
}

// -----------------------
// Schema & Model
// -----------------------
const itemSchema = new mongoose.Schema({
  id: String,
  value: Number,
});

const Item = mongoose.models.Item || mongoose.model("Item", itemSchema);

// -----------------------
// Routes
// -----------------------

// Test route to verify backend & CORS
app.get("/api/test", (req, res) => {
  res.json({
    message: "✅ Backend working",
    mongoUriExists: !!process.env.MONGO_URI,
  });
});

// GET all items
app.get("/api/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    console.error("Error fetching items:", err);
    res.status(500).json({ message: err.message });
  }
});

// POST a new item
app.post("/api/items", async (req, res) => {
  const item = new Item({
    id: req.body.id,
    value: req.body.value,
  });

  try {
    const savedItem = await item.save();
    res.status(201).json(savedItem);
  } catch (err) {
    console.error("Error saving item:", err);
    res.status(400).json({ message: err.message });
  }
});

// -----------------------
// Export app for Vercel
// -----------------------
module.exports = app;
