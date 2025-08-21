  const express = require('express');
  const router = express.Router();
  const otpController = require('../controllers/otpcontroller');
  const User = require('../models/user');

  // OTP routes
  router.post('/send-otp', otpController.sendOtp);
  router.post('/verify-otp', otpController.verifyOtp);

  // Login route
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ message: 'User not found' });

      const isMatch = await user.comparePassword(password);
      if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

      res.status(200).json({
        message: 'Login successful',
        email: user.email,
        role: user.role,
        name: user.name,
        usn: user.usn,
        branch: user.branch,
      });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ message: 'Server error during login' });
    }
  });

  module.exports = router;
