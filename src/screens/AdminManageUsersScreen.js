import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { adminAPI } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';

const AdminManageUsersScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await adminAPI.getUsers();
      if (response.data.success) {
        setUsers(response.data.data);
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
              setUsers(users.filter(u => u._id !== userId));
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
      setUsers(users.map(u => 
        u._id === userId ? { ...u, isActive: !currentStatus } : u
      ));
    } catch (error) {
      Alert.alert('Error', 'Failed to update user');
    }
  };

  const renderUser = ({ item }) => (
    <Card
      title={item.name}
      description={item.email}
    >
      <View style={styles.userDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Role:</Text>
          <Text style={styles.detailValue}>{item.role.toUpperCase()}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Status:</Text>
          <Text style={[styles.detailValue, !item.isActive && styles.inactive]}>
            {item.isActive ? 'Active' : 'Inactive'}
          </Text>
        </View>
        {item.phone && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Phone:</Text>
            <Text style={styles.detailValue}>{item.phone}</Text>
          </View>
        )}
      </View>
      <View style={styles.actions}>
        <Button
          title={item.isActive ? 'Deactivate' : 'Activate'}
          onPress={() => handleToggleActive(item._id, item.isActive)}
          variant="secondary"
          style={styles.actionButton}
        />
        <Button
          title="Delete"
          onPress={() => handleDeleteUser(item._id, item.name)}
          style={[styles.actionButton, styles.deleteButton]}
        />
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerText}>Total Users: {users.length}</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No users found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  listContent: {
    padding: 20,
  },
  userDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 12,
    color: '#333',
  },
  inactive: {
    color: '#FF3B30',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
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

export default AdminManageUsersScreen;


