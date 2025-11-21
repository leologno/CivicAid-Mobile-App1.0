const User = require('../models/User');
const Assignment = require('../models/Assignment');
const Complaint = require('../models/Complaint');

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Get active workload for a user
async function getActiveWorkload(userId) {
  const activeAssignments = await Assignment.countDocuments({
    assignedTo: userId,
    status: 'active',
  });
  return activeAssignments;
}

// Auto-assign complaint to best NGO or Authority
async function autoAssignComplaint(complaintId) {
  try {
    const complaint = await Complaint.findById(complaintId).populate('user');
    if (!complaint) {
      throw new Error('Complaint not found');
    }

    const { category, location } = complaint;
    const candidates = [];

    // Find all NGOs and Authorities
    const ngos = await User.find({ role: 'ngo', isActive: true });
    const authorities = await User.find({ role: 'authority', isActive: true });

    // Evaluate NGOs
    for (const ngo of ngos) {
      if (!ngo.location || !ngo.location.latitude || !ngo.location.longitude) {
        continue;
      }

      const categoryMatch = ngo.ngoDetails?.categories?.includes(category) || false;
      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        ngo.location.latitude,
        ngo.location.longitude
      );
      const workload = await getActiveWorkload(ngo._id);
      const capacity = ngo.ngoDetails?.capacity || 10;

      // Calculate score (higher is better)
      let score = 0;
      if (categoryMatch) score += 50;
      score += Math.max(0, 30 - distance); // Closer = higher score
      score += Math.max(0, 20 - (workload / capacity) * 20); // Lower workload = higher score

      if (workload < capacity) {
        candidates.push({
          user: ngo,
          role: 'ngo',
          categoryMatch,
          distance,
          workload,
          capacity,
          score,
        });
      }
    }

    // Evaluate Authorities
    for (const authority of authorities) {
      if (!authority.location || !authority.location.latitude || !authority.location.longitude) {
        continue;
      }

      const categoryMatch = authority.authorityDetails?.categories?.includes(category) || false;
      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        authority.location.latitude,
        authority.location.longitude
      );
      const workload = await getActiveWorkload(authority._id);
      const capacity = authority.authorityDetails?.capacity || 10;

      let score = 0;
      if (categoryMatch) score += 50;
      score += Math.max(0, 30 - distance);
      score += Math.max(0, 20 - (workload / capacity) * 20);

      if (workload < capacity) {
        candidates.push({
          user: authority,
          role: 'authority',
          categoryMatch,
          distance,
          workload,
          capacity,
          score,
        });
      }
    }

    // Sort by score (highest first)
    candidates.sort((a, b) => b.score - a.score);

    if (candidates.length === 0) {
      return {
        success: false,
        message: 'No available NGO or Authority found for this complaint',
      };
    }

    // Assign to best candidate
    const bestMatch = candidates[0];
    const assignment = await Assignment.create({
      complaint: complaintId,
      assignedTo: bestMatch.user._id,
      assignedRole: bestMatch.role,
      assignmentScore: bestMatch.score,
      categoryMatch: bestMatch.categoryMatch,
      distance: bestMatch.distance,
      workloadAtAssignment: bestMatch.workload,
    });

    // Update complaint
    complaint.status = 'assigned';
    if (bestMatch.role === 'ngo') {
      complaint.assignedTo.ngo = bestMatch.user._id;
    } else {
      complaint.assignedTo.authority = bestMatch.user._id;
    }
    await complaint.save();

    return {
      success: true,
      assignment,
      assignedTo: {
        id: bestMatch.user._id,
        name: bestMatch.user.name,
        role: bestMatch.role,
        email: bestMatch.user.email,
        phone: bestMatch.user.phone,
        categoryMatch: bestMatch.categoryMatch,
        distance: bestMatch.distance.toFixed(2),
        workload: bestMatch.workload,
        capacity: bestMatch.capacity,
        score: bestMatch.score.toFixed(2),
      },
    };
  } catch (error) {
    console.error('Assignment error:', error);
    throw error;
  }
}

module.exports = {
  autoAssignComplaint,
  calculateDistance,
  getActiveWorkload,
};


