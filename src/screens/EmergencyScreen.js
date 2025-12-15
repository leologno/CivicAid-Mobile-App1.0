import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Linking,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS, BORDER_RADIUS } from '../constants/theme';

const EmergencyScreen = ({ navigation }) => {
    const handleCall = (number) => {
        Linking.openURL(`tel:${number}`);
    };

    const EmergencyButton = ({ title, number, icon, color, gradient }) => (
        <TouchableOpacity
            style={styles.emergencyButton}
            onPress={() => handleCall(number)}
            activeOpacity={0.8}
        >
            <LinearGradient
                colors={gradient}
                style={styles.gradientBg}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.iconContainer}>
                    <Ionicons name={icon} size={32} color="#FFF" />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.buttonTitle}>{title}</Text>
                    <Text style={styles.buttonNumber}>{number}</Text>
                </View>
                <Ionicons name="call" size={24} color="#FFF" style={styles.callIcon} />
            </LinearGradient>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            <LinearGradient
                colors={COLORS.gradients.danger} // Use danger gradient for urgency
                style={styles.header}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <SafeAreaView edges={['top']} style={styles.headerContent}>
                    <View style={styles.headerRow}>
                        {/* Back button optional if in tab bar, but good for safety */}
                        <View style={{ width: 24 }} />
                        <Text style={styles.headerTitle}>Emergency Help</Text>
                        <View style={{ width: 24 }} />
                    </View>
                    <Text style={styles.headerSubtitle}>Tap to call immediately</Text>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <EmergencyButton
                    title="National Emergency"
                    number="999"
                    icon="warning"
                    gradient={['#EF4444', '#B91C1C']}
                />

                <EmergencyButton
                    title="Ambulance Service"
                    number="102"
                    icon="medkit"
                    gradient={['#10B981', '#059669']}
                />

                <EmergencyButton
                    title="Fire Department"
                    number="101"
                    icon="flame"
                    gradient={['#F97316', '#EA580C']}
                />

                <EmergencyButton
                    title="Police Control"
                    number="100"
                    icon="shield"
                    gradient={['#3B82F6', '#1E40AF']}
                />

                <View style={styles.infoCard}>
                    <Ionicons name="information-circle" size={24} color={COLORS.primary} />
                    <Text style={styles.infoText}>
                        Use these numbers only in case of genuine emergencies. Misuse is a punishable offense.
                    </Text>
                </View>
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
        marginBottom: SPACING.l,
    },
    headerContent: {
        paddingHorizontal: SPACING.l,
        alignItems: 'center',
    },
    headerRow: { // Center title
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginBottom: SPACING.xs,
    },
    headerTitle: {
        ...TYPOGRAPHY.h2,
        color: '#FFF',
    },
    headerSubtitle: {
        ...TYPOGRAPHY.bodySmall,
        color: 'rgba(255, 255, 255, 0.9)',
    },
    scrollContent: {
        padding: SPACING.l,
    },
    emergencyButton: {
        marginBottom: SPACING.m,
        ...SHADOWS.medium,
    },
    gradientBg: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.l,
        borderRadius: BORDER_RADIUS.l,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.m,
    },
    textContainer: {
        flex: 1,
    },
    buttonTitle: {
        ...TYPOGRAPHY.h3,
        color: '#FFF',
        marginBottom: 4,
    },
    buttonNumber: {
        ...TYPOGRAPHY.h2,
        color: '#FFF',
        letterSpacing: 2,
    },
    callIcon: {
        marginLeft: SPACING.m,
        opacity: 0.8,
    },
    infoCard: {
        flexDirection: 'row',
        backgroundColor: '#E0F2FE', // Light blue
        padding: SPACING.m,
        borderRadius: BORDER_RADIUS.m,
        marginTop: SPACING.l,
        alignItems: 'center',
    },
    infoText: {
        ...TYPOGRAPHY.bodySmall,
        color: '#075985',
        marginLeft: SPACING.m,
        flex: 1,
    },
});

export default EmergencyScreen;
