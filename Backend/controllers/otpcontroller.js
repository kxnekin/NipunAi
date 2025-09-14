const nodemailer = require("nodemailer");
const User = require("../models/user");

const otpStore = {}; // In-memory store for OTPs

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // You can also use "outlook" or custom SMTP
  auth: {
    user: process.env.EMAIL_USER, // your Gmail address
    pass: process.env.EMAIL_PASS, // Gmail app password
  },
});

// ================= Send OTP ================= //
exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 }; // 5 min expiry

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    });

    console.log(`✅ OTP sent to ${email}: ${otp}`);
    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("❌ Error sending OTP:", err);
    res.status(500).json({ message: "Error sending OTP" });
  }
};

// ================= Verify OTP & Create User ================= //
exports.verifyOtp = async (req, res) => {
  const { email, otp, password, role, name, usn, branch } = req.body;

  if (!email || !otp || !password || !name || !usn || !branch) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const record = otpStore[email];
  if (!record) {
    return res.status(400).json({ message: "No OTP sent for this email" });
  }

  const { otp: storedOtp, expiresAt } = record;

  if (Date.now() > expiresAt) {
    delete otpStore[email];
    return res.status(400).json({ message: "OTP expired" });
  }

  if (storedOtp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  delete otpStore[email];

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const newUser = new User({
      name,
      email,
      password,
      role: role || "student",
      usn,
      branch,
    });

    await newUser.save();
    res.json({ message: "OTP verified and user created successfully" });
  } catch (err) {
    console.error("❌ User creation error:", err);
    res.status(500).json({ message: "Server error while creating user" });
  }
};
