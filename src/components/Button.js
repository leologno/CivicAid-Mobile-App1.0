import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

const Button = ({ title, onPress, loading = false, disabled = false, variant = 'primary' }) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'secondary' && styles.buttonSecondary,
        (disabled || loading) && styles.buttonDisabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' ? '#007AFF' : '#FFFFFF'} />
      ) : (
        <Text style={[styles.buttonText, variant === 'secondary' && styles.buttonTextSecondary]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#667eea',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonSecondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#667eea',
    shadowColor: '#667eea',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  buttonTextSecondary: {
    color: '#667eea',
  },
});

export default Button;


