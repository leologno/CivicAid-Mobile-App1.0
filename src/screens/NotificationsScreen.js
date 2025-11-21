import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { notificationAPI } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';

const NotificationsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await notificationAPI.getNotifications();
      if (response.data.success) {
        setNotifications(response.data.data);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadNotifications();
  };

  const markAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, isRead: true } : n
      ));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderNotification = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        if (!item.isRead) markAsRead(item._id);
        if (item.relatedId && item.type === 'complaint') {
          navigation.navigate('ComplaintDetails', { id: item.relatedId });
        }
      }}
    >
      <Card
        title={item.title}
        description={item.message}
      >
        <View style={styles.notificationFooter}>
          <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
          {!item.isRead && <View style={styles.unreadDot} />}
        </View>
      </Card>
    </TouchableOpacity>
  );

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <View style={styles.container}>
      {unreadCount > 0 && (
        <View style={styles.header}>
          <Text style={styles.unreadText}>{unreadCount} unread</Text>
          <Button
            title="Mark All Read"
            onPress={markAllAsRead}
            variant="secondary"
          />
        </View>
      )}
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No notifications</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  unreadText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  listContent: {
    padding: 20,
  },
  notificationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});

export default NotificationsScreen;


