// backend/src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  role: {
    type: String,
    enum: ['parent', 'therapist', 'admin'],
    default: 'parent'
  },
  childName: {
    type: String,
    required: [true, 'Child name is required']
  },
  childAge: {
    type: Number,
    min: 2,
    max: 18
  },
  parentName: {
    type: String
  },
  parentPhone: {
    type: String
  },
  therapistId: {
    type: String
  },
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ⚠️ CRITICAL FIX - This is the correct middleware
userSchema.pre('save', function(next) {
  // Get the user document
  const user = this;
  
  // If password is not modified, skip hashing
  if (!user.isModified('password')) {
    return next();
  }

  // Generate salt and hash password
  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      console.error('Salt error:', err);
      return next(err);
    }
    
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) {
        console.error('Hash error:', err);
        return next(err);
      }
      
      // Replace plain password with hash
      user.password = hash;
      console.log('✅ Password hashed successfully for:', user.email);
      
      // MUST call next() to continue
      next();
    });
  });
});

// Password comparison method
userSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);