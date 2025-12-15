import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, Animated, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS, BORDER_RADIUS } from '../constants/theme';

const Button = ({ title, onPress, loading = false, disabled = false, variant = 'primary', style, textStyle }) => {
  const scaleValue = new Animated.Value(1);

  const onPressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isOutline = variant === 'outline';
  const isDestructive = variant === 'danger';

  const getTextColor = () => {
    if (disabled) return COLORS.surface;
    if (isSecondary || isOutline) return COLORS.primary;
    return COLORS.surface;
  };

  const renderContent = () => (
    <>
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
          {title}
        </Text>
      )}
    </>
  );

  const ButtonContainer = ({ children, ...props }) => {
    if (isPrimary && !disabled) {
      return (
        <LinearGradient
          colors={COLORS.gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.gradient, style]}
          {...props}
        >
          {children}
        </LinearGradient>
      );
    }
    return (
      <View
        style={[
          styles.button,
          isSecondary && styles.secondary,
          isOutline && styles.outline,
          isDestructive && styles.destructive,
          disabled && styles.disabled,
          style,
        ]}
        {...props}
      >
        {children}
      </View>
    );
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }], width: '100%' }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={disabled || loading}
        activeOpacity={0.9}
        style={styles.touchable}
      >
        <ButtonContainer>
          {renderContent()}
        </ButtonContainer>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  touchable: {
    width: '100%',
    ...SHADOWS.large, // Default shadow for buttons
  },
  gradient: {
    paddingVertical: SPACING.m,
    paddingHorizontal: SPACING.l,
    borderRadius: BORDER_RADIUS.full, // Modern pill shape
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    minHeight: 56,
  },
  button: {
    paddingVertical: SPACING.m,
    paddingHorizontal: SPACING.l,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    minHeight: 56,
    backgroundColor: COLORS.surface, // Default for secondary/outline
  },
  secondary: {
    backgroundColor: COLORS.surface,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
    elevation: 0, // No shadow for outline
    shadowOpacity: 0,
  },
  destructive: {
    backgroundColor: COLORS.error,
  },
  text: {
    ...TYPOGRAPHY.button,
    fontWeight: '700',
  },
  disabled: {
    backgroundColor: COLORS.textLight,
    opacity: 0.6,
    elevation: 0,
  },
});

export default Button;
