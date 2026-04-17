const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// connect MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// schema
const ItemSchema = new mongoose.Schema({
  name: String,
  phone: String,
  enrollment: String,
  email: String
});

const Item = mongoose.model("Item", ItemSchema);

// routes

// GET
app.get("/api/items", async (req, res) => {
  const data = await Item.find();
  res.json(data);
});

// POST
app.post("/api/items", async (req, res) => {
  const newItem = new Item(req.body);
  await newItem.save();
  res.json(newItem);
});

// start server
app.listen(process.env.PORT, () => {
  console.log("Server running on port 5000");
});