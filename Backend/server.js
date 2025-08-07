const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/your-db-name", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

// ✅ Auth routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// ✅ Job routes (🔻 Add this below auth routes)
const jobRoutes = require("./routes/jobs");     // ✅ Add this
app.use("/api/jobs", jobRoutes);                // ✅ Mount route

// Health check route
app.get("/", (req, res) => {
  res.send("Backend is running. Use /api/auth or /api/jobs endpoints.");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
