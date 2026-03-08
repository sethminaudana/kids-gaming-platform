// src/controllers/authController.js
const User = require('../models/User');
const ChildProfile = require('../models/ChildProfile');
const GameSession = require('../models/GameSession');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// Register user
const register = async (req, res) => {
  try {
    console.log('📝 Registration request received');
    console.log('Body:', req.body);
    
    const { email, password, role, childName, childAge, parentName, parentPhone, therapistId } = req.body;

    // Validate required fields
    if (!email || !password || !childName) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and child name are required'
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create user data
    const userData = {
      email,
      password,
      role: role || 'parent',
      childName
    };

    if (childAge) userData.childAge = parseInt(childAge);
    if (role === 'parent') {
      if (parentName) userData.parentName = parentName;
      if (parentPhone) userData.parentPhone = parentPhone;
    }
    if (role === 'therapist' && therapistId) {
      userData.therapistId = therapistId;
    }

    // Create user in MongoDB
    const user = new User(userData);
    await user.save();
    console.log('✅ User registered successfully:', user.email);

    // Create ChildProfile
    const childProfile = new ChildProfile({
      parentId: user._id,
      childName: childName,
      childAge: childAge ? parseInt(childAge) : undefined,
      diagnosis: 'None'
    });
    await childProfile.save();
    console.log('✅ Child profile created successfully:', childName);

    // Create initial GameSession record
    const initialSession = new GameSession({
      childId: childProfile._id,
      parentId: user._id,
      difficulty: 'easy',
      pieces: 0,
      timeCompleted: 0,
      tryAgainCount: 0,
      mouseData: {
        mousePath: [],
        avgSpeed: 0,
        totalPathLength: 0
      }
    });
    await initialSession.save();
    console.log('✅ Initial game session created');

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        id: user._id,
        childProfileId: childProfile._id,
        email: user.email,
        role: user.role,
        childName: user.childName,
        childAge: user.childAge,
        parentName: user.parentName,
        token
      }
    });

  } catch (error) {
    console.error('❌ Registration error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }
    
    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(409).json({
        success: false,
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
      });
    }

    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    console.log('🔐 Login attempt:', req.body.email);
    
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user by email and include password field
    const user = await User.findOne({ email }).select('+password');

    // Check if user exists
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user is active
    if (user.isActive === false) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      console.log('❌ Password mismatch for:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // Generate token
    const token = generateToken(user._id);

    console.log('✅ Login successful for:', email);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        id: user._id,
        email: user.email,
        role: user.role,
        childName: user.childName,
        childAge: user.childAge,
        parentName: user.parentName,
        token
      }
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('❌ Profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
};

// Logout user
const logout = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

module.exports = {
  register,
  login,
  getProfile,
  logout
};