const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'subsense-secret', {
    expiresIn: '7d',
  });
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, password, and confirmPassword',
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message,
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message,
    });
  }
});

router.get('/me', protect, (req, res) => {
  return res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      currency: req.user.currency || 'USD',
      defaultCycle: req.user.defaultCycle || 'Monthly',
      emailAlerts: req.user.emailAlerts !== undefined ? req.user.emailAlerts : true,
      budgetAlerts: req.user.budgetAlerts !== undefined ? req.user.budgetAlerts : true,
    },
  });
});

router.put('/preferences', protect, async (req, res) => {
  try {
    const { currency, defaultCycle, emailAlerts, budgetAlerts } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (currency !== undefined) user.currency = currency.trim().toUpperCase();
    if (defaultCycle !== undefined) user.defaultCycle = defaultCycle.trim();
    if (emailAlerts !== undefined) user.emailAlerts = Boolean(emailAlerts);
    if (budgetAlerts !== undefined) user.budgetAlerts = Boolean(budgetAlerts);

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        currency: user.currency,
        defaultCycle: user.defaultCycle,
        emailAlerts: user.emailAlerts,
        budgetAlerts: user.budgetAlerts,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error during preferences update',
      error: error.message,
    });
  }
});

module.exports = router;
