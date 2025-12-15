import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { complaintAPI } from '../services/api';
import { getSocket } from '../services/socket';
import Card from '../components/Card';
import Button from '../components/Button';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS, BORDER_RADIUS } from '../constants/theme';

const DashboardScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadComplaints();

    const socket = getSocket();
    socket.on('complaint_updated', () => loadComplaints());
    socket.on('new_complaint', () => loadComplaints());

    return () => {
      socket.off('complaint_updated');
      socket.off('new_complaint');
    };
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

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000 * 60); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    const options = { weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <LinearGradient
      colors={COLORS.gradients.background}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

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
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section (Exclusive Gradient) */}
        <LinearGradient
          colors={COLORS.gradients.exclusive}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
          <SafeAreaView edges={['top']} style={styles.headerSafe}>
            <View style={styles.headerContent}>

              {/* Line 1: Date/Time + Settings */}
              <View style={styles.headerRow1}>
                <Text style={[styles.greeting, { color: 'rgba(255,255,255,0.8)' }]}>{formatDate(currentTime)}</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Settings')}
                  style={styles.settingsButton}
                  activeOpacity={0.7}
                >
                  <Ionicons name="settings-outline" size={24} color="#FFF" />
                </TouchableOpacity>
              </View>

              {/* Line 2: User Name */}
              <Text style={[styles.name, { color: '#FFF' }]}>{user?.name || 'User'}</Text>

              {/* Line 3: Stats Box (In-flow) */}
              <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                  <View style={[styles.iconContainer, { backgroundColor: '#F3F4F6' }]}>
                    <Ionicons name="document-text-outline" size={20} color={COLORS.textSecondary} />
                  </View>
                  <View>
                    <Text style={styles.statNumber}>{complaints.length}</Text>
                    <Text style={styles.statLabel}>Total</Text>
                  </View>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.statCard}>
                  <View style={[styles.iconContainer, { backgroundColor: '#ECFDF5' }]}>
                    <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.success} />
                  </View>
                  <View>
                    <Text style={[styles.statNumber, { color: COLORS.success }]}>
                      {complaints.filter(c => c.status === 'resolved').length}
                    </Text>
                    <Text style={styles.statLabel}>Resolved</Text>
                  </View>
                </View>
              </View>

            </View>
          </SafeAreaView>
        </LinearGradient>

        <View style={styles.mainContent}>
          {/* Quick Actions Grid */}
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('FileComplaint')}
              activeOpacity={0.8}
            >
              <LinearGradient colors={COLORS.gradients.blue} style={styles.actionIconBg} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <Ionicons name="megaphone" size={24} color="#FFF" />
              </LinearGradient>
              <Text style={styles.actionText}>File Complaint</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('TasksTab')}
              activeOpacity={0.8}
            >
              <LinearGradient colors={COLORS.gradients.orange} style={styles.actionIconBg} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <Ionicons name="search" size={24} color="#FFF" />
              </LinearGradient>
              <Text style={styles.actionText}>Track Status</Text>
            </TouchableOpacity>
          </View>

          {user?.role === 'admin' && (
            <View style={styles.adminSection}>
              <Text style={styles.sectionTitle}>Admin Controls</Text>
              <View style={styles.adminActionsGrid}>
                <Button
                  title="Manage Users"
                  onPress={() => navigation.navigate('Admin', { screen: 'AdminManageUsers' })}
                  variant="outline"
                  style={styles.adminButton}
                />
                <Button
                  title="User Reports"
                  onPress={() => navigation.navigate('Admin', { screen: 'AdminAnalytics' })}
                  variant="outline"
                  style={styles.adminButton}
                />
              </View>
            </View>
          )}

          {/* Recent List */}
          <View style={styles.recentSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Complaints</Text>
              <TouchableOpacity onPress={() => navigation.navigate('TasksTab')}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>

            {complaints.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="file-tray-outline" size={64} color={COLORS.primaryLight} style={styles.emptyIcon} />
                <Text style={styles.emptyText}>No complaints yet</Text>
                <Text style={styles.emptySubText}>Together we can improve our city</Text>
              </View>
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
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // background handled by Gradient
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100, // Accommodate stats card overlap and bottom tab bar
  },
  // Minimalistic Header Styles & Structure
  header: {
    // backgroundColor handled by gradient
    paddingBottom: SPACING.l,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden', // Ensure gradient clips to radius
  },
  headerSafe: {
    zIndex: 1,
  },
  headerContent: {
    paddingHorizontal: SPACING.l,
    paddingTop: 0, // Removed extra padding
  },
  headerRow1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  greeting: {
    ...TYPOGRAPHY.caption,
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  name: {
    ...TYPOGRAPHY.h2,
    fontSize: 28,
    color: COLORS.text,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: SPACING.xl, // Space before stats box
  },
  settingsButton: {
    padding: SPACING.s,
  },

  statsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.l,
    padding: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'space-around',
    // position: 'relative', // Now part of the flow
    width: '100%',
    // Minimal shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.s,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.m,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.s,
  },
  statNumber: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    lineHeight: 24,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  mainContent: {
    paddingTop: SPACING.l, // Normal spacing now that stats are in header flow
    paddingHorizontal: SPACING.l,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    marginBottom: SPACING.m,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  actionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.l,
    padding: SPACING.m,
    width: '48%',
    alignItems: 'center',
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionIconBg: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.s,
  },
  actionText: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '700',
    color: COLORS.text,
  },
  adminSection: {
    marginBottom: SPACING.xl,
  },
  adminActionsGrid: {
    flexDirection: 'column', // Stack vertically
    gap: 16, // Standard vertical spacing
    marginBottom: SPACING.xl,
  },
  adminButton: {
    width: '100%', // Full width
    paddingVertical: 6,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentSection: {
    marginBottom: SPACING.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  seeAllText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.l,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.s,
    opacity: 0.5,
  },
  emptyText: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  emptySubText: {
    ...TYPOGRAPHY.caption,
  },
});

export default DashboardScreen;


