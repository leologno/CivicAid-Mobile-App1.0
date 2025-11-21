const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: [
      'infrastructure',
      'sanitation',
      'safety',
      'environment',
      'health',
      'education',
      'transport',
      'other'
    ],
  },
  location: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  media: [{
    type: String, // File paths
    url: String,
  }],
  status: {
    type: String,
    enum: ['pending', 'assigned', 'in_progress', 'resolved', 'rejected'],
    default: 'pending',
  },
  assignedTo: {
    type: {
      ngo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      authority: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    },
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  resolutionNotes: {
    type: String,
  },
  resolvedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Index for efficient queries
complaintSchema.index({ user: 1, createdAt: -1 });
complaintSchema.index({ status: 1 });
complaintSchema.index({ category: 1 });
complaintSchema.index({ 'location.latitude': 1, 'location.longitude': 1 });

module.exports = mongoose.model('Complaint', complaintSchema);


