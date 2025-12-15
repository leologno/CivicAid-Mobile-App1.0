import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  StatusBar,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS, BORDER_RADIUS } from '../constants/theme';

const UserProfileScreen = ({ navigation }) => {
  const { user, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  // Local state for editing
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.location?.address || '');

  const handleLogout = () => {
    // ... existing logout logic
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            // Add navigation reset if needed
            await logout();
          },
        },
      ]
    );
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    const result = await updateProfile({
      name,
      phone,
      location: { ...user?.location, address }
    });

    if (result.success) {
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } else {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const renderInfoRow = (label, value, isEditable, stateValue, stateSetter) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      {isEditable && isEditing ? (
        <TextInput
          style={styles.input}
          value={stateValue}
          onChangeText={stateSetter}
          placeholder={`Enter ${label}`}
          placeholderTextColor={COLORS.textLight}
        />
      ) : (
        <Text style={styles.infoValue}>{value || 'N/A'}</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.profileHeader}>
            {/* Avatar logic kept same */}
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>

            {isEditing ? (
              <TextInput
                style={styles.nameInput}
                value={name}
                onChangeText={setName}
                placeholder="Enter Name"
              />
            ) : (
              <Text style={styles.name}>{user?.name || 'User'}</Text>
            )}

            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{user?.role?.toUpperCase() || 'USER'}</Text>
            </View>

            <TouchableOpacity
              style={[styles.editModeButton, isEditing && styles.saveButton]}
              onPress={isEditing ? handleSave : () => setIsEditing(true)}
            >
              <Text style={[styles.editModeButtonText, isEditing && styles.saveButtonText]}>
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </Text>
            </TouchableOpacity>
          </View>

          <Card title="Personal Information" style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user?.email || 'N/A'}</Text>
            </View>

            {renderInfoRow('Phone', user?.phone, true, phone, setPhone)}
            {renderInfoRow('Address', user?.location?.address, true, address, setAddress)}
          </Card>

          {/* ... existing role specific cards ... */}
          {user?.role === 'ngo' && user?.ngoDetails && (
            <Card title="NGO Details" style={styles.card}>
              {/* Read only for now */}
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Organization</Text>
                <Text style={styles.infoValue}>{user.ngoDetails.name || 'N/A'}</Text>
              </View>
              {/* ... other ngo details ... */}
            </Card>
          )}

          {user?.role === 'authority' && user?.authorityDetails && (
            <Card title="Authority Details" style={styles.card}>
              {/* ... authority details ... */}
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Department</Text>
                <Text style={styles.infoValue}>{user.authorityDetails.department || 'N/A'}</Text>
              </View>
            </Card>
          )}


          <View style={styles.actions}>
            {isEditing && (
              <Button
                title="Cancel"
                onPress={() => {
                  setIsEditing(false);
                  setName(user?.name);
                  setPhone(user?.phone);
                  setAddress(user?.location?.address);
                }}
                variant="secondary"
                style={styles.actionButton}
              />
            )}

            {!isEditing && (
              <Button
                title="My Assignments"
                onPress={() => navigation.navigate('AssignTasks')}
                variant="secondary"
                style={styles.actionButton}
              />
            )}

            <Button
              title="Logout"
              onPress={handleLogout}
              variant="danger"
              style={[styles.actionButton, styles.logoutButton]}
            />
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
  content: {
    padding: SPACING.l,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    paddingVertical: SPACING.l,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.m,
    ...SHADOWS.large,
    shadowColor: COLORS.primary,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: COLORS.surface,
  },
  name: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  roleBadge: {
    backgroundColor: COLORS.secondary + '20',
    paddingHorizontal: SPACING.m,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.l,
  },
  roleText: {
    ...TYPOGRAPHY.caption,
    fontSize: 12,
    color: COLORS.secondary,
    fontWeight: '700',
  },
  card: {
    marginBottom: SPACING.l,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.s,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoLabel: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    flex: 1,
  },
  infoValue: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    flex: 2,
    textAlign: 'right',
    fontWeight: '500',
  },
  actions: {
    marginTop: SPACING.m,
  },
  actionButton: {
    marginBottom: SPACING.m,
  },
  input: {
    flex: 2,
    textAlign: 'right',
    color: COLORS.text,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
    paddingVertical: 0,
    fontSize: 14,
  },
  nameInput: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
    minWidth: 150,
  },
  editModeButton: {
    marginTop: SPACING.m,
    paddingHorizontal: SPACING.l,
    paddingVertical: SPACING.s,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: '#F1F5F9',
    ...SHADOWS.small,
  },
  editModeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  saveButtonText: {
    color: COLORS.surface,
  },
  logoutButton: {
    marginTop: SPACING.s,
  },
});

export default UserProfileScreen;


