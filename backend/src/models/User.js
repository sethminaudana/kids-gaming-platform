// backend/src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    sparse: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't return password by default
  },
  role: {
    type: String,
    enum: {
      values: ['parent', 'therapist', 'admin'],
      message: 'Role must be parent, therapist, or admin'
    },
    default: 'parent'
  },
  childName: {
    type: String,
    required: [true, 'Child name is required'],
    trim: true
  },
  childAge: {
    type: Number,
    min: [2, 'Child age must be at least 2'],
    max: [18, 'Child age must not exceed 18']
  },
  parentName: {
    type: String,
    trim: true
  },
  parentPhone: {
    type: String,
    trim: true
  },
  therapistId: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// ✅ Pre-save middleware using async/await for password hashing
userSchema.pre('save', async function() {
  // Only hash password if it's modified
  if (!this.isModified('password')) {
    return;
  }

  try {
    // Hash password using bcryptjs
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    console.log('✅ Password hashed successfully for:', this.email);
  } catch (error) {
    console.error('❌ Error hashing password:', error);
    throw error;
  }
});

// Password comparison method
userSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);