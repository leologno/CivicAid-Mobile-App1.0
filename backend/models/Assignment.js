const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  complaint: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complaint',
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assignedRole: {
    type: String,
    enum: ['ngo', 'authority'],
    required: true,
  },
  assignmentScore: {
    type: Number,
    default: 0, // Score based on category match, distance, workload
  },
  categoryMatch: {
    type: Boolean,
    default: false,
  },
  distance: {
    type: Number, // Distance in km
  },
  workloadAtAssignment: {
    type: Number, // Active complaints count at time of assignment
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'reassigned'],
    default: 'active',
  },
  assignedAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

assignmentSchema.index({ complaint: 1 });
assignmentSchema.index({ assignedTo: 1, status: 1 });

module.exports = mongoose.model('Assignment', assignmentSchema);


