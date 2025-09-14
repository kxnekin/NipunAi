const mongoose = require("mongoose");

const RoadmapSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fileUrl: { type: String, required: true },
});

module.exports = mongoose.model("Roadmap", RoadmapSchema);
