import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { adminAPI } from '../services/api';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS, BORDER_RADIUS } from '../constants/theme';
import Card from '../components/Card';

const { width } = Dimensions.get('window');

const AdminAnalyticsScreen = ({ navigation }) => {
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

  const StatCard = ({ label, value, icon, color, gradient }) => (
    <View style={styles.statCardWrapper}>
      <LinearGradient
        colors={gradient}
        style={styles.statCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.statIconContainer}>
          <Ionicons name={icon} size={24} color="#FFF" />
        </View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </LinearGradient>
    </View>
  );

  const SectionTitle = ({ title, icon }) => (
    <View style={styles.sectionHeader}>
      <Ionicons name={icon} size={20} color={COLORS.primary} style={styles.sectionIcon} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  const StatusItem = ({ label, count, color, total }) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
      <View style={styles.statusItem}>
        <View style={styles.statusHeader}>
          <Text style={styles.statusLabel}>{label}</Text>
          <Text style={[styles.statusCount, { color }]}>{count}</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${percentage}%`, backgroundColor: color }
            ]}
          />
        </View>
      </View>
    );
  };

  if (loading || !analytics) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        <Text>Loading analytics...</Text>
      </View>
    );
  }

  const getStatusCount = (status) => {
    const item = analytics.complaintsByStatus?.find(s => s._id === status);
    return item?.count || 0;
  };

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
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: '#FFF' }]}>Analytics</Text>
            <View style={{ width: 24 }} />
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
      >
        {/* Overview Stats Grid */}
        <View style={styles.gridContainer}>
          <StatCard
            label="Total Users"
            value={analytics.totals.users}
            icon="people"
            gradient={COLORS.gradients.blue}
          />
          <StatCard
            label="Complaints"
            value={analytics.totals.complaints}
            icon="document-text"
            gradient={COLORS.gradients.orange}
          />
          <StatCard
            label="Assignments"
            value={analytics.totals.assignments}
            icon="briefcase"
            gradient={['#8B5CF6', '#7C3AED']}
          />
          <StatCard
            label="Recent (7d)"
            value={analytics.totals.recentComplaints}
            icon="time"
            gradient={COLORS.gradients.success}
          />
        </View>

        {/* Complaints by Status */}
        <View style={styles.section}>
          <SectionTitle title="Complaint Status" icon="pie-chart" />
          <Card style={styles.card}>
            <StatusItem
              label="Pending"
              count={getStatusCount('pending')}
              color={COLORS.warning}
              total={analytics.totals.complaints}
            />
            <StatusItem
              label="In Progress"
              count={getStatusCount('in_progress')}
              color={COLORS.info}
              total={analytics.totals.complaints}
            />
            <StatusItem
              label="Resolved"
              count={getStatusCount('resolved')}
              color={COLORS.success}
              total={analytics.totals.complaints}
            />
            <StatusItem
              label="Rejected"
              count={getStatusCount('rejected')}
              color={COLORS.error}
              total={analytics.totals.complaints}
            />
          </Card>
        </View>

        {/* Users by Role */}
        <View style={styles.section}>
          <SectionTitle title="User Distribution" icon="person-circle" />
          <Card style={styles.card}>
            {analytics.usersByRole?.map((item) => (
              <View key={item._id} style={styles.roleRow}>
                <View style={styles.roleInfo}>
                  <View style={[styles.roleDot, { backgroundColor: COLORS.primary }]} />
                  <Text style={styles.roleLabel}>
                    {item._id.charAt(0).toUpperCase() + item._id.slice(1)}
                  </Text>
                </View>
                <Text style={styles.roleCount}>{item.count}</Text>
              </View>
            ))}
          </Card>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingBottom: SPACING.l,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: SPACING.m,
  },
  headerContent: {
    paddingHorizontal: SPACING.l,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: SPACING.xs,
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.surface,
  },
  scrollContent: {
    padding: SPACING.l,
    paddingTop: SPACING.s,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.l,
  },
  statCardWrapper: {
    width: (width - SPACING.l * 2 - SPACING.m) / 2,
    marginBottom: SPACING.m,
  },
  statCard: {
    padding: SPACING.m,
    borderRadius: BORDER_RADIUS.l,
    height: 120,
    justifyContent: 'space-between',
    ...SHADOWS.medium,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    ...TYPOGRAPHY.h2,
    color: COLORS.surface,
    fontSize: 28,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  section: {
    marginBottom: SPACING.l,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  sectionIcon: {
    marginRight: SPACING.s,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
  },
  card: {
    padding: SPACING.l,
  },
  statusItem: {
    marginBottom: SPACING.m,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  statusLabel: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text,
    fontWeight: '600',
  },
  statusCount: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '700',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  roleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.s,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  roleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.s,
  },
  roleLabel: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
  },
  roleCount: {
    ...TYPOGRAPHY.body,
    fontWeight: '700',
    color: COLORS.text,
  },
});

export default AdminAnalyticsScreen;


