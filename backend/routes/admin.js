const express = require('express');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getComplaints,
  getAnalytics,
  getReports,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/complaints', getComplaints);
router.get('/analytics', getAnalytics);
router.get('/reports', getReports);

module.exports = router;


