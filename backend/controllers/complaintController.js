const Complaint = require('../models/Complaint');
const Assignment = require('../models/Assignment');
const Notification = require('../models/Notification');
const { autoAssignComplaint } = require('../utils/assignmentEngine');
const path = require('path');

// @desc    Create complaint
// @route   POST /api/v1/complaints/create
// @access  Private
exports.createComplaint = async (req, res, next) => {
  try {
    const { title, description, category, location, priority } = req.body;

    const complaint = await Complaint.create({
      user: req.user.id,
      title,
      description,
      category,
      location: JSON.parse(location || '{}'),
      priority: priority || 'medium',
      media: req.files ? req.files.map(file => ({
        type: path.extname(file.originalname),
        url: `/uploads/${file.filename}`,
      })) : [],
    });

    // Auto-assign complaint
    try {
      const assignmentResult = await autoAssignComplaint(complaint._id);

      if (assignmentResult.success) {
        // Create notification for assigned entity
        await Notification.create({
          user: assignmentResult.assignedTo.id,
          title: 'New Complaint Assigned',
          message: `You have been assigned a new complaint: ${title}`,
          type: 'assignment',
          relatedId: complaint._id,
        });
      }

      // Create notification for user
      await Notification.create({
        user: req.user.id,
        title: 'Complaint Submitted',
        message: `Your complaint "${title}" has been submitted successfully.`,
        type: 'complaint',
        relatedId: complaint._id,
      });

      // Emit Socket Event for new complaint/assignment
      const io = req.app.get('io');
      io.emit('new_complaint', {
        complaint: complaint,
      });

      if (assignmentResult.success) {
        io.emit('refresh_assignments', {}); // Tell NGOs/Volunteers to refresh
      }

    } catch (assignError) {
      console.error('Auto-assignment error:', assignError);
      // Continue even if assignment fails
    }

    const populatedComplaint = await Complaint.findById(complaint._id)
      .populate('user', 'name email')
      .populate('assignedTo.ngo', 'name email phone')
      .populate('assignedTo.authority', 'name email phone');

    res.status(201).json({
      success: true,
      data: populatedComplaint,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload media for complaint
// @route   POST /api/v1/complaints/upload-media/:id
// @access  Private
exports.uploadMedia = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    // Check ownership
    if (complaint.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this complaint',
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded',
      });
    }

    const newMedia = req.files.map(file => ({
      type: path.extname(file.originalname),
      url: `/uploads/${file.filename}`,
    }));

    complaint.media = [...complaint.media, ...newMedia];
    await complaint.save();

    res.status(200).json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all complaints by user
// @route   GET /api/v1/complaints/user
// @access  Private
exports.getUserComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find({ user: req.user.id })
      .populate('assignedTo.ngo', 'name email phone')
      .populate('assignedTo.authority', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get complaint by ID
// @route   GET /api/v1/complaints/:id
// @access  Private
exports.getComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('assignedTo.ngo', 'name email phone ngoDetails')
      .populate('assignedTo.authority', 'name email phone authorityDetails');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    // Check authorization
    if (complaint.user._id.toString() !== req.user.id &&
      req.user.role !== 'admin' &&
      complaint.assignedTo?.ngo?._id?.toString() !== req.user.id &&
      complaint.assignedTo?.authority?._id?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this complaint',
      });
    }

    // Get assignment details
    const assignment = await Assignment.findOne({
      complaint: complaint._id,
      status: 'active',
    }).populate('assignedTo', 'name email phone');

    res.status(200).json({
      success: true,
      data: {
        complaint,
        assignment,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update complaint status
// @route   PUT /api/v1/complaints/:id/status
// @access  Private
exports.updateStatus = async (req, res, next) => {
  try {
    const { status, resolutionNotes } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    // Check authorization
    const isOwner = complaint.user.toString() === req.user.id;
    const isAssigned = complaint.assignedTo?.ngo?.toString() === req.user.id ||
      complaint.assignedTo?.authority?.toString() === req.user.id;

    if (!isOwner && !isAssigned && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this complaint',
      });
    }

    complaint.status = status;
    if (resolutionNotes) {
      complaint.resolutionNotes = resolutionNotes;
    }
    if (status === 'resolved') {
      complaint.resolvedAt = new Date();
    }
    await complaint.save();

    // Create notification
    await Notification.create({
      user: complaint.user,
      title: 'Complaint Status Updated',
      message: `Your complaint "${complaint.title}" status has been updated to ${status}`,
      type: 'status_update',
      relatedId: complaint._id,
    });

    // Emit Socket Event
    const io = req.app.get('io');
    io.emit('complaint_updated', {
      complaintId: complaint._id,
      status: status,
      complaint: complaint,
    });

    res.status(200).json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    next(error);
  }
};


