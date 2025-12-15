import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { complaintAPI, assignmentAPI } from '../services/api';
import MapView, { Marker } from 'react-native-maps';
import Button from '../components/Button';
import Card from '../components/Card';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS, BORDER_RADIUS } from '../constants/theme';

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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved': return COLORS.success;
      case 'in_progress': return COLORS.warning;
      case 'assigned': return COLORS.info;
      default: return COLORS.textSecondary;
    }
  };

  if (loading || !complaint) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading details...</Text>
      </View>
    );
  }

  // ... inside ComplaintDetailsScreen
  const handleAdminAction = (newStatus) => {
    Alert.prompt(
      newStatus === 'resolved' ? 'Resolve Complaint' : 'Terminate Complaint',
      'Add a note for this action:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async (note) => {
            try {
              setLoading(true);
              const response = await complaintAPI.updateStatus(id, newStatus, note);
              if (response.data.success) {
                Alert.alert('Success', `Complaint ${newStatus === 'resolved' ? 'resolved' : 'terminated'}`);
                loadDetails(); // Reload to show updates
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to update status');
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const isAssignee = user?.role === 'ngo' || user?.role === 'authority' || user?.role === 'volunteer';
  const isAdmin = user?.role === 'admin';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {/* ... existing header/title ... */}
          <Text style={styles.pageTitle}>Complaint Details</Text>

          {/* Status Banner */}
          <View style={[styles.statusBanner, { backgroundColor: getStatusColor(complaint.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(complaint.status) }]}>
              {complaint.status?.replace('_', ' ').toUpperCase()}
            </Text>
          </View>

          <Card title={complaint.title} style={styles.card}>
            <Text style={styles.description}>{complaint.description}</Text>
          </Card>

          {/* ... existing info section ... */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Information</Text>
            {/* ... Category, Priority, Created, Location ... */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Category</Text>
              <Text style={styles.detailValue}>{complaint.category}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Priority</Text>
              <Text style={styles.detailValue}>{complaint.priority}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Created</Text>
              <Text style={styles.detailValue}>{formatDate(complaint.createdAt)}</Text>
            </View>
            {complaint.location && (
              <View style={styles.sectionMargin}>
                <Text style={styles.detailLabel}>Location</Text>
                <Text style={styles.addressText}>{complaint.location.address}</Text>
                {complaint.location.latitude && complaint.location.longitude && (
                  <View style={styles.mapContainer}>
                    <MapView
                      style={styles.map}
                      initialRegion={{
                        latitude: parseFloat(complaint.location.latitude),
                        longitude: parseFloat(complaint.location.longitude),
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005,
                      }}
                      scrollEnabled={false}
                      zoomEnabled={false}
                    >
                      <Marker
                        coordinate={{
                          latitude: parseFloat(complaint.location.latitude),
                          longitude: parseFloat(complaint.location.longitude),
                        }}
                      />
                    </MapView>
                  </View>
                )}
              </View>
            )}
          </View>

          {/* ... existing assignment section ... */}
          {assignment ? (
            <View style={styles.section}>
              {/* ... assignment details ... */}
              <Text style={styles.sectionTitle}>Assigned Unit</Text>
              <Card style={styles.assignmentCard}>
                <View style={styles.assignmentHeader}>
                  <View>
                    <Text style={styles.assignedName}>{assignment.assignedTo.name}</Text>
                    <Text style={styles.assignedRole}>{assignment.assignedRole.toUpperCase()}</Text>
                  </View>
                  {assignment.categoryMatch && (
                    <View style={styles.verifiedBadge}>
                      <Text style={styles.verifiedText}>Verified</Text>
                    </View>
                  )}
                </View>
                {/* Contacts */}
                {assignment.assignedTo.email && (
                  <Text style={styles.assignedContact}>Email: {assignment.assignedTo.email}</Text>
                )}
                {assignment.assignedTo.phone && (
                  <Text style={styles.assignedContact}>Phone: {assignment.assignedTo.phone}</Text>
                )}
              </Card>
            </View>
          ) : (
            <View style={styles.section}>
              <View style={styles.unassignedBox}>
                <Text style={styles.unassignedText}>Not yet assigned to a unit.</Text>
              </View>
            </View>
          )}

          {/* ... existing media section ... */}
          {complaint.media && complaint.media.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Media Attachments</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaScroll}>
                {complaint.media.map((item, index) => (
                  <Image
                    key={index}
                    source={{ uri: `http://192.168.0.6:5000${item.url}` }}
                    style={styles.mediaImage}
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {/* Proof of Work Section (New) */}
          {complaint.proofs && complaint.proofs.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Proof of Work</Text>
              {complaint.proofs.map((proof, index) => (
                <View key={index} style={styles.proofCard}>
                  {proof.imageUrl && (
                    <Image source={{ uri: `http://192.168.0.6:5000${proof.imageUrl}` }} style={styles.proofImage} />
                  )}
                  <Text style={styles.proofNote}>{proof.note}</Text>
                  <Text style={styles.proofDate}>{formatDate(proof.createdAt)}</Text>
                </View>
              ))}
            </View>
          )}


          {/* Result Section */}
          {complaint.resolutionNotes && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Resolution/Termination Notes</Text>
              <View style={[styles.notesBox, complaint.status === 'rejected' ? { backgroundColor: '#FEF2F2' } : { backgroundColor: '#ECFDF5' }]}>
                <Text style={[styles.resolutionText, complaint.status === 'rejected' ? { color: COLORS.error } : { color: COLORS.success }]}>
                  {complaint.resolutionNotes}
                </Text>
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actions}>
            {/* Assignees can update situation */}
            {isAssignee && complaint.status === 'assigned' && (
              <Button
                title="Update Situation (Upload Proof)"
                onPress={() => navigation.navigate('AttachMedia', { complaintId: id, isProof: true })}
                variant="primary"
                style={styles.actionButton}
              />
            )}

            {/* Admin can Resolve or Terminate */}
            {isAdmin && complaint.status !== 'resolved' && complaint.status !== 'rejected' && (
              <>
                <Button
                  title="Mark as Resolved"
                  onPress={() => handleAdminAction('resolved')}
                  variant="primary" // Should be Green
                  style={[styles.actionButton, { backgroundColor: COLORS.success }]}
                />
                <Button
                  title="Terminate (Reject)"
                  onPress={() => handleAdminAction('rejected')}
                  variant="danger"
                  style={styles.actionButton}
                />
              </>
            )}

            {/* Users can add more initial media if pending */}
            {user?.role === 'user' && complaint.status === 'pending' && (
              <Button
                title="Attach More Media"
                onPress={() => navigation.navigate('AttachMedia', { complaintId: id })}
                variant="secondary"
                style={styles.actionButton}
              />
            )}
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    ...TYPOGRAPHY.body,
    marginTop: SPACING.m,
  },
  content: {
    padding: SPACING.l,
  },
  pageTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
    marginBottom: SPACING.m,
  },
  statusBanner: {
    paddingVertical: SPACING.s,
    paddingHorizontal: SPACING.m,
    borderRadius: BORDER_RADIUS.m,
    alignSelf: 'flex-start',
    marginBottom: SPACING.m,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  card: {
    marginBottom: SPACING.l,
  },
  description: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    marginTop: SPACING.s,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    marginBottom: SPACING.m,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.s,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  detailLabel: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  detailValue: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontWeight: '500',
    maxWidth: '60%',
    textAlign: 'right',
  },
  assignmentCard: {
    backgroundColor: COLORS.surface,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  assignmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.m,
  },
  assignedName: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
  },
  assignedRole: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '700',
    marginTop: 2,
  },
  verifiedBadge: {
    backgroundColor: COLORS.success + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  verifiedText: {
    fontSize: 10,
    color: COLORS.success,
    fontWeight: '700',
  },
  assignedContact: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  unassignedBox: {
    padding: SPACING.l,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.m,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    borderStyle: 'dashed',
  },
  unassignedText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textLight,
  },
  mediaScroll: {
    marginBottom: SPACING.s,
  },
  mediaImage: {
    width: 200,
    height: 150,
    borderRadius: BORDER_RADIUS.m,
    marginRight: SPACING.m,
    backgroundColor: COLORS.inputBg,
  },
  notesBox: {
    backgroundColor: COLORS.inputBg,
    padding: SPACING.m,
    borderRadius: BORDER_RADIUS.m,
  },
  resolutionText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
  },
  sectionMargin: {
    marginTop: SPACING.m,
  },
  addressText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    marginBottom: SPACING.s,
  },
  mapContainer: {
    height: 150,
    borderRadius: BORDER_RADIUS.m,
    overflow: 'hidden',
    marginTop: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  actionButton: {
    marginTop: SPACING.l,
    marginBottom: SPACING.s, // Add spacing between buttons
  },
  proofCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.m,
    borderRadius: BORDER_RADIUS.m,
    marginBottom: SPACING.m,
    ...SHADOWS.small,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.secondary,
  },
  proofImage: {
    width: '100%',
    height: 180,
    borderRadius: BORDER_RADIUS.s,
    marginBottom: SPACING.s,
    backgroundColor: COLORS.inputBg,
  },
  proofNote: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontStyle: 'italic',
    marginBottom: SPACING.xs,
  },
  proofDate: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
    textAlign: 'right',
  },
});

export default ComplaintDetailsScreen;


