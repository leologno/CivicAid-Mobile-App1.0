const Assignment = require('../models/Assignment');
const Complaint = require('../models/Complaint');
const { autoAssignComplaint } = require('../utils/assignmentEngine');

// @desc    Get assignment details for a complaint
// @route   GET /api/v1/assignments/complaint/:id
// @access  Private
exports.getAssignmentByComplaint = async (req, res, next) => {
  try {
    const assignment = await Assignment.findOne({
      complaint: req.params.id,
      status: 'active',
    })
      .populate('assignedTo', 'name email phone role ngoDetails authorityDetails location')
      .populate('complaint', 'title category status');

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'No active assignment found for this complaint',
      });
    }

    res.status(200).json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all assignments for logged in user (NGO/Authority)
// @route   GET /api/v1/assignments/my-assignments
// @access  Private
exports.getMyAssignments = async (req, res, next) => {
  try {
    if (req.user.role !== 'ngo' && req.user.role !== 'authority' && req.user.role !== 'volunteer' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only NGOs, Authorities, and Volunteers can view their assignments',
      });
    }

    const assignments = await Assignment.find({
      assignedTo: req.user.id,
      status: 'active',
    })
      .populate('complaint')
      .sort({ assignedAt: -1 });

    res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Manually reassign complaint
// @route   POST /api/v1/assignments/reassign/:complaintId
// @access  Private/Admin
exports.reassignComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.complaintId);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    // Mark old assignment as reassigned
    await Assignment.updateMany(
      { complaint: req.params.complaintId, status: 'active' },
      { status: 'reassigned' }
    );

    // Auto-assign again
    const result = await autoAssignComplaint(req.params.complaintId);

    res.status(200).json({
      success: result.success,
      message: result.message || 'Complaint reassigned successfully',
      data: result.assignedTo,
    });
  } catch (error) {
    next(error);
  }
};


