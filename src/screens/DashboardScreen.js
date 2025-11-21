import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { complaintAPI } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';

const DashboardScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      const response = await complaintAPI.getUserComplaints();
      if (response.data.success) {
        setComplaints(response.data.data.slice(0, 5)); // Show latest 5
      }
    } catch (error) {
      console.error('Error loading complaints:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadComplaints();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.name}>{user?.name || 'User'}</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{complaints.length}</Text>
          <Text style={styles.statLabel}>My Complaints</Text>
        </View>
        <View style={[styles.statCard, styles.statCardLast]}>
          <Text style={styles.statNumber}>
            {complaints.filter(c => c.status === 'resolved').length}
          </Text>
          <Text style={styles.statLabel}>Resolved</Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <Button
          title="File New Complaint"
          onPress={() => navigation.navigate('FileComplaint')}
        />
        <Button
          title="Track Complaints"
          onPress={() => navigation.navigate('TrackComplaints')}
          variant="secondary"
          style={styles.actionButton}
        />
      </View>

      {user?.role === 'admin' && (
        <View style={styles.adminSection}>
          <Text style={styles.sectionTitle}>Admin Panel</Text>
          <Button
            title="Manage Users"
            onPress={() => navigation.navigate('AdminManageUsers')}
            variant="secondary"
            style={styles.actionButton}
          />
          <Button
            title="View Analytics"
            onPress={() => navigation.navigate('AdminAnalytics')}
            variant="secondary"
            style={styles.actionButton}
          />
        </View>
      )}

      <View style={styles.recentSection}>
        <Text style={styles.sectionTitle}>Recent Complaints</Text>
        {complaints.length === 0 ? (
          <Text style={styles.emptyText}>No complaints yet. File your first complaint!</Text>
        ) : (
          complaints.map((complaint) => (
            <Card
              key={complaint._id}
              title={complaint.title}
              description={complaint.description}
              status={complaint.status}
              onPress={() => navigation.navigate('ComplaintDetails', { id: complaint._id })}
            />
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
    backgroundColor: '#F8F9FA',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  greeting: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  name: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a1a',
    marginTop: 4,
    letterSpacing: -0.5,
  },
  logoutButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#FFF5F5',
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '700',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  statCardLast: {
    marginRight: 0,
  },
  statNumber: {
    fontSize: 36,
    fontWeight: '800',
    color: '#667eea',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actionsContainer: {
    padding: 20,
  },
  actionButton: {
    marginTop: 12,
    marginBottom: 12,
  },
  adminSection: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    marginTop: 12,
    marginHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  recentSection: {
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 15,
    marginTop: 20,
    fontWeight: '500',
  },
});

export default DashboardScreen;


