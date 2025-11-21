const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false,
  },
  phone: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'ngo', 'volunteer', 'authority'],
    default: 'user',
  },
  location: {
    type: {
      latitude: Number,
      longitude: Number,
      address: String,
    },
  },
  ngoDetails: {
    name: String,
    registrationNumber: String,
    categories: [String], // Categories this NGO handles
    capacity: Number, // Max concurrent complaints
  },
  authorityDetails: {
    department: String,
    jurisdiction: String,
    categories: [String],
    capacity: Number,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password method
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
userSchema.methods.generateToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET || 'your_super_secret_jwt_key',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

module.exports = mongoose.model('User', userSchema);


