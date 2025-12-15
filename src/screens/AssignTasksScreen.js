import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { assignmentAPI } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS, BORDER_RADIUS } from '../constants/theme';

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
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading tasks...</Text>
      </View>
    );
  }

  // Single Assignment Details View
  if (complaintId && assignment) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />
        <ScrollView
          style={styles.container}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
        >
          <View style={styles.content}>
            <Text style={styles.pageTitle}>Assignment Details</Text>

            <Card title="Assigned Unit" style={styles.card}>
              <Text style={styles.teamName}>{assignment.assignedTo.name}</Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>{assignment.assignedRole.toUpperCase()}</Text>
              </View>

              {assignment.assignedTo.email && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Email</Text>
                  <Text style={styles.detailValue}>{assignment.assignedTo.email}</Text>
                </View>
              )}

              {assignment.assignedTo.phone && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Phone</Text>
                  <Text style={styles.detailValue}>{assignment.assignedTo.phone}</Text>
                </View>
              )}
            </Card>

            <Card title="Performance Metrics" style={styles.card}>
              <View style={styles.metricRow}>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Category Match</Text>
                  <Text style={[styles.metricValue, assignment.categoryMatch ? styles.successText : styles.errorText]}>
                    {assignment.categoryMatch ? 'Yes' : 'No'}
                  </Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Distance</Text>
                  <Text style={styles.metricValue}>
                    {assignment.distance ? `${assignment.distance.toFixed(1)} km` : 'N/A'}
                  </Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Match Score</Text>
                  <Text style={[styles.metricValue, { color: COLORS.primary }]}>
                    {assignment.assignmentScore ? assignment.assignmentScore.toFixed(1) : 'N/A'}
                  </Text>
                </View>
              </View>
            </Card>

            {assignment.assignedTo.ngoDetails && (
              <Card title="NGO Profile" style={styles.card}>
                <Text style={styles.detailText}>
                  {assignment.assignedTo.ngoDetails.name || 'N/A'}
                </Text>
                <Text style={styles.detailSubtext}>
                  Capacity: {assignment.assignedTo.ngoDetails.capacity || 0} active cases
                </Text>
              </Card>
            )}

            {assignment.assignedTo.authorityDetails && (
              <Card title="Authority Profile" style={styles.card}>
                <Text style={styles.detailText}>
                  {assignment.assignedTo.authorityDetails.department || 'N/A'}
                </Text>
                <Text style={styles.detailSubtext}>
                  Jurisdiction: {assignment.assignedTo.authorityDetails.jurisdiction || 'N/A'}
                </Text>
              </Card>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Dashboard View (My Assignments)
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />
      <ScrollView
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <View>
              <Text style={styles.pageTitle}>My Tasks</Text>
              <Text style={styles.pageSubtitle}>
                {myAssignments.length} active assignments
              </Text>
            </View>
          </View>

          {myAssignments.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>All Caught Up!</Text>
              <Text style={styles.emptyText}>You have no pending assignments at the moment.</Text>
            </View>
          ) : (
            myAssignments.map((assignment) => (
              <Card
                key={assignment._id}
                title={assignment.complaint?.title || 'Complaint'}
                status={assignment.complaint?.status}
                onPress={() => navigation.navigate('ComplaintDetails', { id: assignment.complaint._id })}
                style={styles.taskCard}
              >
                <View style={styles.taskMeta}>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>Assigned</Text>
                    <Text style={styles.metaValue}>
                      {new Date(assignment.assignedAt).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>Priority</Text>
                    <Text style={[styles.metaValue, { color: COLORS.warning, fontWeight: '700' }]}>
                      {assignment.complaint?.priority?.toUpperCase() || 'MEDIUM'}
                    </Text>
                  </View>
                </View>

                <Button
                  title="View Details"
                  onPress={() => navigation.navigate('ComplaintDetails', { id: assignment.complaint?._id })}
                  style={styles.cardButton}
                />
              </Card>
            ))
          )}
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
  header: {
    marginBottom: SPACING.l,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pageTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
  },
  pageSubtitle: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  card: {
    marginBottom: SPACING.l,
  },
  teamName: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  roleBadge: {
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: SPACING.s,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.s,
    alignSelf: 'flex-start',
    marginBottom: SPACING.m,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
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
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.s,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  successText: {
    color: COLORS.success,
  },
  errorText: {
    color: COLORS.error,
  },
  detailText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  detailSubtext: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    marginBottom: SPACING.s,
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  taskCard: {
    marginBottom: SPACING.l,
  },
  taskMeta: {
    flexDirection: 'row',
    marginTop: SPACING.m,
    marginBottom: SPACING.m,
    backgroundColor: COLORS.background,
    padding: SPACING.m,
    borderRadius: BORDER_RADIUS.m,
  },
  metaItem: {
    marginRight: SPACING.xl,
  },
  metaLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 2,
    fontWeight: '600',
  },
  metaValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  cardButton: {
    minHeight: 44,
    paddingVertical: SPACING.s,
  },
});

export default AssignTasksScreen;

