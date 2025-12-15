import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { complaintAPI, assignmentAPI } from '../services/api';
import { getSocket } from '../services/socket';
import Card from '../components/Card';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS, BORDER_RADIUS } from '../constants/theme';

const TrackComplaintsScreen = ({ navigation }) => {
  const { user } = useAuth(); // Get user to check role
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();

    // Connect to Socket
    const socket = getSocket();

    socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    // Listen for updates
    socket.on('complaint_updated', (data) => {
      setComplaints(prev => prev.map(item =>
        item._id === data.complaintId ? { ...item, status: data.status } : item
      ));
    });

    socket.on('refresh_assignments', () => {
      if (user?.role !== 'user') {
        loadData();
      }
    });

    socket.on('new_complaint', () => {
      if (user?.role !== 'user') loadData();
    });

    return () => {
      socket.off('complaint_updated');
      socket.off('refresh_assignments');
      socket.off('new_complaint');
    };
  }, []);

  const loadData = async () => {
    try {
      let response;
      if (user?.role === 'user') {
        // Citizens track their own complaints
        response = await complaintAPI.getUserComplaints();
        if (response.data.success) {
          setComplaints(response.data.data);
        }
      } else {
        // NGOs, Authorities, Volunteers track ASSIGNED tasks
        // We import assignmentAPI directly or from services if exported
        // Note: assignmentAPI was not imported in previous snippet, adding it to imports
        response = await assignmentAPI.getMyAssignments();
        if (response.data.success) {
          // Structure might be different: response.data.data is array of assignments
          // We need to map assignments to complaints for display
          const tasks = response.data.data.map(a => ({
            ...a.complaint, // Spread complaint data
            assignmentId: a._id,
            assignedAt: a.assignedAt
          }));
          setComplaints(tasks);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderComplaint = ({ item }) => (
    <Card
      title={item.title}
      description={`${item.description.substring(0, 100)}...`}
      status={item.status}
      onPress={() => navigation.navigate('ComplaintDetails', { id: item._id })}
      style={styles.card}
    >
      <View style={styles.complaintFooter}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
      </View>
    </Card>
  );

  return (
    <LinearGradient
      colors={COLORS.gradients.background}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <LinearGradient
        colors={COLORS.gradients.exclusive}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView edges={['top']} style={styles.headerContent}>
          <Text style={[styles.pageTitle, { color: '#FFF' }]}>
            {user?.role === 'user' ? 'Your Complaints' : 'Assigned Tasks'}
          </Text>
        </SafeAreaView>
      </LinearGradient>

      <FlatList
        data={complaints}
        renderItem={renderComplaint}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {user?.role === 'user' ? 'No complaints found' : 'No tasks assigned yet'}
            </Text>
            {user?.role === 'user' && (
              <TouchableOpacity
                onPress={() => navigation.navigate('FileComplaint')}
                style={styles.emptyButton}
              >
                <Text style={styles.emptyButtonText}>File Your First Complaint</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingBottom: SPACING.l,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: SPACING.m,
  },
  headerContent: {
    paddingHorizontal: SPACING.l,
    paddingTop: SPACING.m,
  },
  pageTitle: {
    ...TYPOGRAPHY.h2,
    color: '#FFF',
  },
  listContent: {
    padding: SPACING.l,
    paddingBottom: 100, // accommodate bottom tab bar
  },
  card: {
    marginBottom: SPACING.m,
  },
  complaintFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.m,
    paddingTop: SPACING.s,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  categoryBadge: {
    backgroundColor: COLORS.primary + '15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
  },
  categoryText: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  date: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyText: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textLight,
    marginBottom: SPACING.l,
    textAlign: 'center',
  },
  emptyButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.l,
    paddingVertical: SPACING.m,
    borderRadius: BORDER_RADIUS.m,
    ...SHADOWS.medium,
  },
  emptyButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.surface,
  },
});

export default TrackComplaintsScreen;
