import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker'; // Keep specific import
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS, BORDER_RADIUS } from '../constants/theme';

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('user');
  const [adminSecretCode, setAdminSecretCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    if (role === 'admin' && !adminSecretCode) {
      Alert.alert('Error', 'Admin secret code is required to register as admin');
      return;
    }

    setLoading(true);
    const result = await register({
      name,
      email,
      password,
      phone,
      role,
      adminSecretCode: role === 'admin' ? adminSecretCode : undefined,
    });
    setLoading(false);

    if (!result.success) {
      Alert.alert('Registration Failed', result.message);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Background Gradient */}
      <LinearGradient
        colors={COLORS.gradients.primary}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Text style={styles.logoIcon}>👋</Text>
              </View>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join CivicAid and make a difference</Text>
            </View>

            <View style={styles.card}>
              <View style={styles.form}>
                <Input
                  label="Full Name"
                  value={name}
                  onChangeText={setName}
                  placeholder="John Doe"
                />

                <Input
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="name@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <Input
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Min 6 characters"
                  secureTextEntry
                />

                <Input
                  label="Phone (Optional)"
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="+880..."
                  keyboardType="phone-pad"
                />

                <View style={styles.pickerContainer}>
                  <Text style={styles.label}>Role</Text>
                  <View style={styles.pickerWrapper}>
                    <Picker
                      selectedValue={role}
                      onValueChange={setRole}
                      style={styles.picker}
                      dropdownIconColor={COLORS.textSecondary}
                    >
                      <Picker.Item label="User" value="user" />
                      <Picker.Item label="Admin" value="admin" />
                      <Picker.Item label="NGO" value="ngo" />
                      <Picker.Item label="Volunteer" value="volunteer" />
                      <Picker.Item label="Authority" value="authority" />
                    </Picker>
                  </View>
                </View>

                {role === 'admin' && (
                  <Input
                    label="Admin Secret Code"
                    value={adminSecretCode}
                    onChangeText={setAdminSecretCode}
                    placeholder="Enter secret code"
                    secureTextEntry
                  />
                )}

                <Button
                  title="Create Account"
                  onPress={handleSignup}
                  loading={loading}
                  style={styles.button}
                />

                <View style={styles.footer}>
                  <Text style={styles.footerText}>Already have an account? </Text>
                  <Text
                    style={styles.linkText}
                    onPress={() => navigation.navigate('Login')}
                  >
                    Sign In
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%', // Cover top part
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SPACING.l,
    paddingTop: SPACING.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    marginTop: SPACING.s,
  },
  logoContainer: {
    width: 72,
    height: 72,
    borderRadius: BORDER_RADIUS.xl,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.m,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.surface,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.l,
    ...SHADOWS.large,
    marginBottom: SPACING.l,
  },
  form: {
    width: '100%',
  },
  pickerContainer: {
    marginBottom: SPACING.m,
  },
  label: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    marginLeft: SPACING.xs,
    fontWeight: '600',
  },
  pickerWrapper: {
    backgroundColor: COLORS.inputBg,
    borderRadius: BORDER_RADIUS.m,
    borderWidth: 1.5,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  picker: {
    height: 52,
    color: COLORS.text,
  },
  button: {
    marginTop: SPACING.s,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.l,
  },
  footerText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
  linkText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.primary,
    fontWeight: '700',
  },
});

export default SignupScreen;

