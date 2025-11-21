import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { complaintAPI, assignmentAPI } from '../services/api';
import Button from '../components/Button';
import Card from '../components/Card';

const ComplaintDetailsScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const [complaint, setComplaint] = useState(null);
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDetails();
  }, [id]);

  const loadDetails = async () => {
    try {
      const [complaintRes, assignmentRes] = await Promise.all([
        complaintAPI.getComplaint(id),
        assignmentAPI.getAssignmentByComplaint(id).catch(() => null),
      ]);

      if (complaintRes.data.success) {
        setComplaint(complaintRes.data.data.complaint);
      }

      if (assignmentRes?.data?.success) {
        setAssignment(assignmentRes.data.data);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load complaint details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading || !complaint) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#667eea" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card title={complaint.title} status={complaint.status}>
          <Text style={styles.description}>{complaint.description}</Text>
        </Card>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Category:</Text>
            <Text style={styles.detailValue}>{complaint.category}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Priority:</Text>
            <Text style={styles.detailValue}>{complaint.priority}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Created:</Text>
            <Text style={styles.detailValue}>{formatDate(complaint.createdAt)}</Text>
          </View>
          {complaint.location && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Location:</Text>
              <Text style={styles.detailValue}>{complaint.location.address}</Text>
            </View>
          )}
        </View>

        {assignment && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Assigned To</Text>
            <Card>
              <Text style={styles.assignedName}>{assignment.assignedTo.name}</Text>
              <Text style={styles.assignedRole}>{assignment.assignedRole.toUpperCase()}</Text>
              {assignment.assignedTo.email && (
                <Text style={styles.assignedContact}>Email: {assignment.assignedTo.email}</Text>
              )}
              {assignment.assignedTo.phone && (
                <Text style={styles.assignedContact}>Phone: {assignment.assignedTo.phone}</Text>
              )}
              {assignment.distance && (
                <Text style={styles.assignedContact}>
                  Distance: {assignment.distance.toFixed(2)} km
                </Text>
              )}
              {assignment.categoryMatch && (
                <Text style={styles.matchBadge}>✓ Category Match</Text>
              )}
            </Card>
          </View>
        )}

        {complaint.media && complaint.media.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Media</Text>
            {complaint.media.map((item, index) => (
              <Image
                key={index}
                source={{ uri: `http://10.0.2.2:5000${item.url}` }}
                style={styles.mediaImage}
              />
            ))}
          </View>
        )}

        {complaint.resolutionNotes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resolution Notes</Text>
            <Text style={styles.resolutionText}>{complaint.resolutionNotes}</Text>
          </View>
        )}

        <Button
          title="Attach More Media"
          onPress={() => navigation.navigate('AttachMedia', { complaintId: id })}
          variant="secondary"
        />
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  content: {
    padding: 20,
  },
  description: {
    fontSize: 16,
    color: '#1a1a1a',
    lineHeight: 24,
    marginTop: 8,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
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
    color: '#1a1a1a',
    textTransform: 'capitalize',
    fontWeight: '500',
  },
  assignedName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  assignedRole: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '700',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  assignedContact: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  matchBadge: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '700',
    marginTop: 12,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  mediaImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#E5E5E5',
  },
  resolutionText: {
    fontSize: 15,
    color: '#1a1a1a',
    lineHeight: 22,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
});

export default ComplaintDetailsScreen;


