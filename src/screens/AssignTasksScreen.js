import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { assignmentAPI } from '../services/api';
import Card from '../components/Card';

const AssignTasksScreen = ({ route, navigation }) => {
  const { complaintId } = route.params || {};
  const [assignment, setAssignment] = useState(null);
  const [myAssignments, setMyAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (complaintId) {
      loadAssignment();
    } else {
      loadMyAssignments();
    }
  }, [complaintId]);

  const loadAssignment = async () => {
    try {
      const response = await assignmentAPI.getAssignmentByComplaint(complaintId);
      if (response.data.success) {
        setAssignment(response.data.data);
      }
    } catch (error) {
      console.error('Error loading assignment:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadMyAssignments = async () => {
    try {
      const response = await assignmentAPI.getMyAssignments();
      if (response.data.success) {
        setMyAssignments(response.data.data);
      }
    } catch (error) {
      console.error('Error loading assignments:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    if (complaintId) {
      loadAssignment();
    } else {
      loadMyAssignments();
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (complaintId && assignment) {
    return (
      <ScrollView
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Assignment Details</Text>
          
          <Card title="Assigned Team">
            <Text style={styles.teamName}>{assignment.assignedTo.name}</Text>
            <Text style={styles.teamRole}>{assignment.assignedRole.toUpperCase()}</Text>
            
            {assignment.assignedTo.email && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Email:</Text>
                <Text style={styles.detailValue}>{assignment.assignedTo.email}</Text>
              </View>
            )}
            
            {assignment.assignedTo.phone && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Phone:</Text>
                <Text style={styles.detailValue}>{assignment.assignedTo.phone}</Text>
              </View>
            )}
          </Card>

          <Card title="Assignment Metrics">
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Category Match:</Text>
              <Text style={[styles.detailValue, assignment.categoryMatch && styles.matchYes]}>
                {assignment.categoryMatch ? '✓ Yes' : '✗ No'}
              </Text>
            </View>
            
            {assignment.distance && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Distance:</Text>
                <Text style={styles.detailValue}>{assignment.distance.toFixed(2)} km</Text>
              </View>
            )}
            
            {assignment.workloadAtAssignment !== undefined && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Workload at Assignment:</Text>
                <Text style={styles.detailValue}>{assignment.workloadAtAssignment} active tasks</Text>
              </View>
            )}
            
            {assignment.assignmentScore && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Match Score:</Text>
                <Text style={styles.detailValue}>{assignment.assignmentScore.toFixed(2)}</Text>
              </View>
            )}
          </Card>

          {assignment.assignedTo.ngoDetails && (
            <Card title="NGO Details">
              <Text style={styles.detailText}>
                {assignment.assignedTo.ngoDetails.name || 'N/A'}
              </Text>
              {assignment.assignedTo.ngoDetails.capacity && (
                <Text style={styles.detailText}>
                  Capacity: {assignment.assignedTo.ngoDetails.capacity} complaints
                </Text>
              )}
            </Card>
          )}

          {assignment.assignedTo.authorityDetails && (
            <Card title="Authority Details">
              <Text style={styles.detailText}>
                Department: {assignment.assignedTo.authorityDetails.department || 'N/A'}
              </Text>
              <Text style={styles.detailText}>
                Jurisdiction: {assignment.assignedTo.authorityDetails.jurisdiction || 'N/A'}
              </Text>
            </Card>
          )}
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.content}>
        <Text style={styles.title}>My Assignments</Text>
        
        {myAssignments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No assignments found</Text>
          </View>
        ) : (
          myAssignments.map((assignment) => (
            <Card
              key={assignment._id}
              title={assignment.complaint?.title || 'Complaint'}
              status={assignment.complaint?.status}
              onPress={() => navigation.navigate('ComplaintDetails', { id: assignment.complaint._id })}
            >
              <Text style={styles.assignmentInfo}>
                Assigned: {new Date(assignment.assignedAt).toLocaleDateString()}
              </Text>
            </Card>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  teamName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  teamRole: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
  },
  matchYes: {
    color: '#34C759',
    fontWeight: '600',
  },
  detailText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  assignmentInfo: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});

export default AssignTasksScreen;

