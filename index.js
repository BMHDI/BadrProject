const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors"); // <-- Add this line

dotenv.config();

const app = express();
app.use(cors()); // <-- Use CORS
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:5500'
}));
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Schema and Model
const itemSchema = new mongoose.Schema({
  name: String,
  value: Number,
});

const Item = mongoose.model("Item", itemSchema);

// GET all items
app.get("/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new item
app.post("/items", async (req, res) => {
  const item = new Item({
    name: req.body.name,
    value: req.body.value,
  });

  try {
    const savedItem = await item.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
