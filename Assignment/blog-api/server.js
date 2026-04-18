const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// DB Connection
connectDB();

// Routes
app.use("/blogs", require("./routes/blogRoutes"));

// Start Server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});