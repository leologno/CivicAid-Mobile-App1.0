const express = require('express');
const {
  getAssignmentByComplaint,
  getMyAssignments,
  reassignComplaint,
} = require('../controllers/assignmentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/complaint/:id', getAssignmentByComplaint);
router.get('/my-assignments', getMyAssignments);
router.post('/reassign/:complaintId', authorize('admin'), reassignComplaint);

module.exports = router;


