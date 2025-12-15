import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { adminAPI } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS, BORDER_RADIUS } from '../constants/theme';

const AdminManageUsersScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = users.filter(
        user =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  const loadUsers = async () => {
    try {
      const response = await adminAPI.getUsers();
      if (response.data.success) {
        setUsers(response.data.data);
        setFilteredUsers(response.data.data);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load users');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadUsers();
  };

  const handleDeleteUser = (userId, userName) => {
    Alert.alert(
      'Delete User',
      `Are you sure you want to delete ${userName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await adminAPI.deleteUser(userId);
              const updatedUsers = users.filter(u => u._id !== userId);
              setUsers(updatedUsers);
              Alert.alert('Success', 'User deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete user');
            }
          },
        },
      ]
    );
  };

  const handleToggleActive = async (userId, currentStatus) => {
    try {
      await adminAPI.updateUser(userId, { isActive: !currentStatus });
      const updatedUsers = users.map(u =>
        u._id === userId ? { ...u, isActive: !currentStatus } : u
      );
      setUsers(updatedUsers);
    } catch (error) {
      Alert.alert('Error', 'Failed to update user');
    }
  };

  const renderUser = ({ item }) => (
    <Card style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
        </View>
        <View style={[styles.roleBadge, { backgroundColor: item.role === 'admin' ? '#E0E7FF' : '#F3F4F6' }]}>
          <Text style={[styles.roleText, { color: item.role === 'admin' ? COLORS.primary : COLORS.textSecondary }]}>
            {item.role.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.userDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="call-outline" size={16} color={COLORS.textSecondary} style={styles.icon} />
          <Text style={styles.detailValue}>{item.phone || 'N/A'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons
            name={item.isActive ? "checkmark-circle-outline" : "ban-outline"}
            size={16}
            color={item.isActive ? COLORS.success : COLORS.error}
            style={styles.icon}
          />
          <Text style={[styles.detailValue, { color: item.isActive ? COLORS.success : COLORS.error }]}>
            {item.isActive ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Button
          title={item.isActive ? 'Deactivate' : 'Activate'}
          onPress={() => handleToggleActive(item._id, item.isActive)}
          variant="outline"
          style={styles.actionButton}
          textStyle={styles.actionButtonText}
        />
        <Button
          title="Delete"
          onPress={() => handleDeleteUser(item._id, item.name)}
          variant="danger"
          style={[styles.actionButton, styles.deleteButton]}
          textStyle={styles.actionButtonText}
        />
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
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: '#FFF' }]}>Manage Users</Text>
            <View style={{ width: 24 }} />
          </View>
          <Text style={[styles.headerSubtitle, { color: 'rgba(255,255,255,0.8)' }]}>{users.length} Registered Users</Text>
        </SafeAreaView>
      </LinearGradient>

      <View style={styles.searchContainer}>
        <Input
          placeholder="Search by name or email..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          icon="search-outline"
          style={styles.searchInput}
        />
      </View>

      <FlatList
        data={filteredUsers}
        renderItem={renderUser}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={48} color={COLORS.textLight} />
            <Text style={styles.emptyText}>No users found</Text>
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
    paddingBottom: SPACING.xl,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    paddingHorizontal: SPACING.l,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  backButton: {
    padding: SPACING.xs,
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.surface,
  },
  headerSubtitle: {
    ...TYPOGRAPHY.bodySmall,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  searchContainer: {
    paddingHorizontal: SPACING.l,
    marginTop: -SPACING.l,
  },
  searchInput: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.l,
    ...SHADOWS.medium,
  },
  listContent: {
    padding: SPACING.l,
    paddingTop: SPACING.m,
  },
  card: {
    marginBottom: SPACING.m,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.m,
  },
  userInfo: {
    flex: 1,
    marginRight: SPACING.m,
  },
  userName: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    marginBottom: 2,
  },
  userEmail: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
  roleBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: BORDER_RADIUS.s,
  },
  roleText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
  },
  userDetails: {
    flexDirection: 'row',
    marginBottom: SPACING.l,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.l,
  },
  icon: {
    marginRight: SPACING.xs,
  },
  detailValue: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text,
  },
  actions: {
    flexDirection: 'column', // Stack vertically
    marginTop: 8,
  },
  actionButton: {
    width: '100%', // Full width
    marginBottom: 8, // Space between buttons
    paddingVertical: 0,
    minHeight: 28,
    borderRadius: 8,
    paddingHorizontal: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  deleteButton: {
    marginBottom: 0, // Remove margin for last item
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textLight,
    marginTop: SPACING.m,
  },
});

export default AdminManageUsersScreen;


