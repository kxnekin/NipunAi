const express = require("express");
const router = express.Router();
const User = require("../models/user");

// ✅ Fetch all students
router.get("/students", async (req, res) => {
  try {
    const students = await User.find({}, "name email branch usn resumeUrl workExperience");
    res.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Failed to fetch students" });
  }
});

// ✅ Fetch details of one student
router.get("/student/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const student = await User.findOne({ email });
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ message: "Failed to fetch student details" });
  }
});

module.exports = router;
