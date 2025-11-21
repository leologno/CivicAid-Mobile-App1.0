const express = require('express');
const {
  createComplaint,
  uploadMedia,
  getUserComplaints,
  getComplaint,
  updateStatus,
} = require('../controllers/complaintController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.use(protect);

router.post('/create', upload.array('media', 10), createComplaint);
router.post('/upload-media/:id', upload.array('media', 10), uploadMedia);
router.get('/user', getUserComplaints);
router.get('/:id', getComplaint);
router.put('/:id/status', updateStatus);

module.exports = router;


