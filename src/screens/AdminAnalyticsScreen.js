import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { adminAPI } from '../services/api';
import Card from '../components/Card';

const AdminAnalyticsScreen = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const response = await adminAPI.getAnalytics();
      if (response.data.success) {
        setAnalytics(response.data.data);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadAnalytics();
  };

  if (loading || !analytics) {
    return (
      <View style={styles.container}>
        <Text>Loading analytics...</Text>
      </View>
    );
  }

  const getStatusCount = (status) => {
    const item = analytics.complaintsByStatus?.find(s => s._id === status);
    return item?.count || 0;
  };

  const getCategoryCount = (category) => {
    const item = analytics.complaintsByCategory?.find(c => c._id === category);
    return item?.count || 0;
  };

  const getRoleCount = (role) => {
    const item = analytics.usersByRole?.find(r => r._id === role);
    return item?.count || 0;
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Analytics Dashboard</Text>

        <Card title="Overview">
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{analytics.totals.users}</Text>
              <Text style={styles.statLabel}>Total Users</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{analytics.totals.complaints}</Text>
              <Text style={styles.statLabel}>Total Complaints</Text>
            </View>
          </View>
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{analytics.totals.assignments}</Text>
              <Text style={styles.statLabel}>Assignments</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{analytics.totals.recentComplaints}</Text>
              <Text style={styles.statLabel}>Last 7 Days</Text>
            </View>
          </View>
        </Card>

        <Card title="Complaints by Status">
          <View style={styles.listItem}>
            <Text style={styles.listLabel}>Pending:</Text>
            <Text style={styles.listValue}>{getStatusCount('pending')}</Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listLabel}>Assigned:</Text>
            <Text style={styles.listValue}>{getStatusCount('assigned')}</Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listLabel}>In Progress:</Text>
            <Text style={styles.listValue}>{getStatusCount('in_progress')}</Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listLabel}>Resolved:</Text>
            <Text style={[styles.listValue, styles.resolved]}>
              {getStatusCount('resolved')}
            </Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listLabel}>Rejected:</Text>
            <Text style={styles.listValue}>{getStatusCount('rejected')}</Text>
          </View>
        </Card>

        <Card title="Complaints by Category">
          {analytics.complaintsByCategory?.map((item) => (
            <View key={item._id} style={styles.listItem}>
              <Text style={styles.listLabel}>
                {item._id.charAt(0).toUpperCase() + item._id.slice(1)}:
              </Text>
              <Text style={styles.listValue}>{item.count}</Text>
            </View>
          ))}
        </Card>

        <Card title="Users by Role">
          {analytics.usersByRole?.map((item) => (
            <View key={item._id} style={styles.listItem}>
              <Text style={styles.listLabel}>
                {item._id.charAt(0).toUpperCase() + item._id.slice(1)}:
              </Text>
              <Text style={styles.listValue}>{item.count}</Text>
            </View>
          ))}
        </Card>
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
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  listLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  listValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  resolved: {
    color: '#34C759',
  },
});

export default AdminAnalyticsScreen;


