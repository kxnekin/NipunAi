// controllers/otpController.js
const nodemailer = require('nodemailer');
const User = require('../models/user');
require('dotenv').config();

const otpStore = {}; // Temporary in-memory store

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

  otpStore[email] = { otp, expiresAt };

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}: ${otp}`);
    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp, password, role, name } = req.body;

  if (!email || !otp || !password || !name) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const record = otpStore[email];
  if (!record) {
    return res.status(400).json({ message: 'No OTP sent for this email' });
  }

  const { otp: storedOtp, expiresAt } = record;

  if (Date.now() > expiresAt) {
    delete otpStore[email];
    return res.status(400).json({ message: 'OTP expired' });
  }

  if (storedOtp !== otp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  delete otpStore[email];

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const newUser = new User({
      name,
      email,
      password,
      role: role || 'student',
    });

    await newUser.save();
    res.json({ message: 'OTP verified and user created successfully' });
  } catch (err) {
    console.error('User creation error:', err);
    res.status(500).json({ message: 'Server error while creating user' });
  }
};