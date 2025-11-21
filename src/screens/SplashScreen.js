import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const SplashScreen = () => {
  const navigation = useNavigation();
  const { loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        try {
          if (isAuthenticated) {
            navigation.replace('App');
          } else {
            navigation.replace('Auth');
          }
        } catch (error) {
          console.error('Navigation error:', error);
          // Fallback: try navigating to Auth if App fails
          if (isAuthenticated) {
            navigation.navigate('Auth');
          }
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [loading, isAuthenticated, navigation]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.gradientOverlay} />
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoIcon}>🏛️</Text>
            </View>
          </View>
          <Text style={styles.logo}>CivicAid</Text>
          <Text style={styles.tagline}>Connecting Communities</Text>
          <Text style={styles.subtitle}>Making civic engagement simple</Text>
        </View>
        <ActivityIndicator size="large" color="#FFFFFF" style={styles.loader} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#667eea',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#764ba2',
    opacity: 0.8,
  },
  content: {
    alignItems: 'center',
    marginBottom: 60,
    zIndex: 1,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoIcon: {
    fontSize: 60,
  },
  logo: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 12,
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 18,
    color: '#FFF',
    opacity: 0.95,
    marginBottom: 8,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.8,
    fontWeight: '400',
  },
  loader: {
    marginTop: 40,
    zIndex: 1,
  },
});

export default SplashScreen;

