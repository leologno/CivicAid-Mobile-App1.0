import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Switch,
    TouchableOpacity,
    ScrollView,
    Alert,
    StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS, BORDER_RADIUS } from '../constants/theme';

import { useTheme } from '../context/ThemeContext';
// ... imports

const SettingsScreen = ({ navigation }) => {
    const { user, logout } = useAuth();
    const { isDarkMode, toggleTheme, colors } = useTheme(); // Use context
    const [notifications, setNotifications] = useState(true);
    const [biometrics, setBiometrics] = useState(false);
    // Remove local darkMode state

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const savedNotifs = await AsyncStorage.getItem('settings_notifications');
            const savedBio = await AsyncStorage.getItem('settings_biometrics');
            if (savedNotifs !== null) setNotifications(JSON.parse(savedNotifs));
            if (savedBio !== null) setBiometrics(JSON.parse(savedBio));
        } catch (e) {
            console.error('Failed to load settings');
        }
    };

    const toggleNotifications = async (value) => {
        setNotifications(value);
        await AsyncStorage.setItem('settings_notifications', JSON.stringify(value));
    };

    const toggleBiometrics = async (value) => {
        setBiometrics(value);
        await AsyncStorage.setItem('settings_biometrics', JSON.stringify(value));
    };

    const handleLogout = () => {
        Alert.alert(
            'Log Out',
            'Are you sure you want to log out?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Log Out', style: 'destructive', onPress: logout }, // Call logout from context
            ]
        );
    };

    // ... existing components

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* ... header ... */}

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* ... profile section ... */}

                <SectionHeader title="Preferences" />
                <View style={[styles.card, { backgroundColor: colors.surface }]}>
                    <SettingItem
                        icon="notifications-outline"
                        title="Push Notifications"
                        subtitle="Receive updates about complaints"
                        toggle={toggleNotifications}
                        value={notifications}
                    />
                    <View style={styles.divider} />
                    <SettingItem
                        icon="moon-outline"
                        title="Dark Mode"
                        toggle={toggleTheme}
                        value={isDarkMode}
                    />
                </View>

                {/* ... Account Section ... */}

                <SectionHeader title="Account" />
                <View style={styles.card}>
                    <SettingItem
                        icon="lock-closed-outline"
                        title="Change Password"
                        onPress={() => Alert.alert('Change Password', 'This feature will be available in the next update.')}
                    />
                    <View style={styles.divider} />
                    <SettingItem
                        icon="finger-print-outline"
                        title="Biometric Login"
                        toggle={toggleBiometrics}
                        value={biometrics}
                    />
                </View>

                <SectionHeader title="Support & Info" />
                <View style={styles.card}>
                    <SettingItem
                        icon="help-circle-outline"
                        title="Help Center"
                        onPress={() => Alert.alert('Help Center', 'Contact support at: support@civicaid.org\n\nFAQ:\n1. How to file?\n2. How to track?')}
                    />
                    <View style={styles.divider} />
                    <SettingItem
                        icon="document-text-outline"
                        title="Privacy Policy"
                        onPress={() => Alert.alert('Privacy Policy', 'We value your privacy. Your data is encrypted and secure.\n\nRead full policy at: civicaid.org/privacy')}
                    />
                    <View style={styles.divider} />
                    <SettingItem
                        icon="information-circle-outline"
                        title="About CivicAid"
                        subtitle="Version 1.0.0"
                        onPress={() => Alert.alert('About CivicAid', 'CivicAid v1.0.0\n\nEmpowering citizens to build better communities.\n\nDeveloped by CivicAid Team.')}
                    />
                </View>

                {/* ... logout ... */}

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                <Text style={styles.copyrightText}>© 2025 CivicAid. All rights reserved.</Text>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        paddingBottom: SPACING.l,
        borderBottomLeftRadius: BORDER_RADIUS.xl,
        borderBottomRightRadius: BORDER_RADIUS.xl,
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
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        padding: SPACING.m,
        borderRadius: BORDER_RADIUS.l,
        marginBottom: SPACING.l,
        ...SHADOWS.small,
    },
    avatarContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#E0E7FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.m,
    },
    userName: {
        ...TYPOGRAPHY.h3,
        color: COLORS.text,
    },
    userEmail: {
        ...TYPOGRAPHY.caption,
        color: COLORS.textSecondary,
    },
    editButton: {
        marginLeft: 'auto',
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.xs,
        backgroundColor: '#F1F5F9',
        borderRadius: BORDER_RADIUS.full,
    },
    editButtonText: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.primary,
    },
    sectionHeader: {
        ...TYPOGRAPHY.bodySmall,
        fontWeight: '700',
        color: COLORS.textSecondary,
        marginBottom: SPACING.s,
        marginLeft: SPACING.xs,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.l,
        marginBottom: SPACING.l,
        ...SHADOWS.small,
        overflow: 'hidden',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: SPACING.m,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: BORDER_RADIUS.m,
        backgroundColor: '#F8FAFC',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.m,
    },
    textContainer: {
        flex: 1,
    },
    settingTitle: {
        ...TYPOGRAPHY.body,
        fontWeight: '500',
        color: COLORS.text,
    },
    settingSubtitle: {
        ...TYPOGRAPHY.caption,
        color: COLORS.textLight,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginLeft: 56,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.m,
        backgroundColor: '#FEF2F2',
        borderRadius: BORDER_RADIUS.l,
        marginTop: SPACING.s,
    },
    logoutText: {
        ...TYPOGRAPHY.body,
        fontWeight: '600',
        color: COLORS.error,
        marginLeft: SPACING.s,
    },
    copyrightText: {
        ...TYPOGRAPHY.caption,
        color: COLORS.textLight,
        textAlign: 'center',
        marginTop: SPACING.xl,
        marginBottom: SPACING.l,
    },
});

const SectionHeader = ({ title }) => (
    <View style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionHeader}>{title}</Text>
    </View>
);

const SettingItem = ({ icon, title, subtitle, toggle, value, onPress }) => (
    <TouchableOpacity
        style={styles.settingItem}
        onPress={onPress}
        disabled={!!toggle}
    >
        <View style={styles.settingLeft}>
            <View style={styles.iconContainer}>
                <Ionicons name={icon} size={20} color={COLORS.primary} />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.settingTitle}>{title}</Text>
                {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
            </View>
        </View>

        {toggle ? (
            <Switch
                value={value}
                onValueChange={toggle}
                trackColor={{ false: '#CBD5E1', true: COLORS.primary }}
                thumbColor={'#FFF'}
            />
        ) : (
            <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
        )}
    </TouchableOpacity>
);

export default SettingsScreen;
