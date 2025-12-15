import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS, BORDER_RADIUS } from '../constants/theme';

const Card = ({ title, description, status, onPress, children, style }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
        return COLORS.success;
      case 'in_progress':
        return COLORS.warning;
      case 'assigned':
        return COLORS.info;
      default:
        return COLORS.textSecondary;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      {title && (
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>{title}</Text>
          {status && (
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status) + '20' }]}>
              <Text style={[styles.statusText, { color: getStatusColor(status) }]}>
                {status.toUpperCase()}
              </Text>
            </View>
          )}
        </View>
      )}
      {description && <Text style={styles.description} numberOfLines={3}>{description}</Text>}
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.l,
    padding: SPACING.l,
    marginBottom: SPACING.m,
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.s,
  },
  title: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    flex: 1,
    marginRight: SPACING.s,
  },
  statusBadge: {
    paddingHorizontal: SPACING.s,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.s,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  description: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
});

export default Card;


