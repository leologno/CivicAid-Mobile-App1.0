const User = require('../models/User');
const Complaint = require('../models/Complaint');
const Assignment = require('../models/Assignment');

// @desc    Get all users
// @route   GET /api/v1/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID
// @route   GET /api/v1/admin/users/:id
// @access  Private/Admin
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/v1/admin/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/v1/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all complaints
// @route   GET /api/v1/admin/complaints
// @access  Private/Admin
exports.getComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find()
      .populate('user', 'name email')
      .populate('assignedTo.ngo', 'name email')
      .populate('assignedTo.authority', 'name email')
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

// @desc    Get analytics
// @route   GET /api/v1/admin/analytics
// @access  Private/Admin
exports.getAnalytics = async (req, res, next) => {
  try {
    // Total counts
    const totalUsers = await User.countDocuments();
    const totalComplaints = await User.countDocuments();
    const totalComplaintsActual = await Complaint.countDocuments();
    const totalAssignments = await Assignment.countDocuments();

    // Complaints by status
    const complaintsByStatus = await Complaint.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Complaints by category
    const complaintsByCategory = await Complaint.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);

    // Users by role
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
        },
      },
    ]);

    // Recent complaints (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentComplaints = await Complaint.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    res.status(200).json({
      success: true,
      data: {
        totals: {
          users: totalUsers,
          complaints: totalComplaintsActual,
          assignments: totalAssignments,
          recentComplaints,
        },
        complaintsByStatus,
        complaintsByCategory,
        usersByRole,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reports
// @route   GET /api/v1/admin/reports
// @access  Private/Admin
exports.getReports = async (req, res, next) => {
  try {
    const { startDate, endDate, category, status } = req.query;

    const query = {};
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    if (category) query.category = category;
    if (status) query.status = status;

    const complaints = await Complaint.find(query)
      .populate('user', 'name email')
      .populate('assignedTo.ngo', 'name email')
      .populate('assignedTo.authority', 'name email')
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


