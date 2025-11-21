import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';

const UserProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={styles.name}>{user?.name || 'User'}</Text>
          <Text style={styles.role}>{user?.role?.toUpperCase() || 'USER'}</Text>
        </View>

        <Card title="Personal Information">
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{user?.email || 'N/A'}</Text>
          </View>
          {user?.phone && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone:</Text>
              <Text style={styles.infoValue}>{user.phone}</Text>
            </View>
          )}
          {user?.location?.address && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Location:</Text>
              <Text style={styles.infoValue}>{user.location.address}</Text>
            </View>
          )}
        </Card>

        {user?.role === 'ngo' && user?.ngoDetails && (
          <Card title="NGO Details">
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>NGO Name:</Text>
              <Text style={styles.infoValue}>{user.ngoDetails.name || 'N/A'}</Text>
            </View>
            {user.ngoDetails.registrationNumber && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Registration:</Text>
                <Text style={styles.infoValue}>{user.ngoDetails.registrationNumber}</Text>
              </View>
            )}
            {user.ngoDetails.categories && user.ngoDetails.categories.length > 0 && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Categories:</Text>
                <Text style={styles.infoValue}>
                  {user.ngoDetails.categories.join(', ')}
                </Text>
              </View>
            )}
            {user.ngoDetails.capacity && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Capacity:</Text>
                <Text style={styles.infoValue}>{user.ngoDetails.capacity} complaints</Text>
              </View>
            )}
          </Card>
        )}

        {user?.role === 'authority' && user?.authorityDetails && (
          <Card title="Authority Details">
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Department:</Text>
              <Text style={styles.infoValue}>
                {user.authorityDetails.department || 'N/A'}
              </Text>
            </View>
            {user.authorityDetails.jurisdiction && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Jurisdiction:</Text>
                <Text style={styles.infoValue}>{user.authorityDetails.jurisdiction}</Text>
              </View>
            )}
            {user.authorityDetails.categories && user.authorityDetails.categories.length > 0 && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Categories:</Text>
                <Text style={styles.infoValue}>
                  {user.authorityDetails.categories.join(', ')}
                </Text>
              </View>
            )}
          </Card>
        )}

        <View style={styles.actions}>
          <Button
            title="My Assignments"
            onPress={() => navigation.navigate('AssignTasks')}
            variant="secondary"
          />
          <Button
            title="Notifications"
            onPress={() => navigation.navigate('Notifications')}
            variant="secondary"
            style={styles.actionButton}
          />
          <Button
            title="Logout"
            onPress={handleLogout}
            style={[styles.actionButton, styles.logoutButton]}
          />
        </View>
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  role: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    flex: 2,
    textAlign: 'right',
  },
  actions: {
    marginTop: 24,
  },
  actionButton: {
    marginTop: 12,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
  },
});

export default UserProfileScreen;


