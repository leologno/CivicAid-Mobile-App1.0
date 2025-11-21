import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Card = ({ title, description, status, onPress, children }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved':
        return '#10B981';
      case 'in_progress':
        return '#F59E0B';
      case 'assigned':
        return '#667eea';
      case 'pending':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      {title && (
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {status && (
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status) }]}>
              <Text style={styles.statusText}>{status.toUpperCase()}</Text>
            </View>
          )}
        </View>
      )}
      {description && <Text style={styles.description}>{description}</Text>}
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    flex: 1,
    marginRight: 12,
    lineHeight: 24,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    maxWidth: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  statusText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
});

export default Card;


