import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { complaintAPI } from '../services/api';
import Card from '../components/Card';

const TrackComplaintsScreen = ({ navigation }) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      const response = await complaintAPI.getUserComplaints();
      if (response.data.success) {
        setComplaints(response.data.data);
      }
    } catch (error) {
      console.error('Error loading complaints:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadComplaints();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderComplaint = ({ item }) => (
    <Card
      title={item.title}
      description={`${item.description.substring(0, 100)}...`}
      status={item.status}
      onPress={() => navigation.navigate('ComplaintDetails', { id: item._id })}
    >
      <View style={styles.complaintFooter}>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <FlatList
        data={complaints}
        renderItem={renderComplaint}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No complaints found</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('FileComplaint')}
              style={styles.emptyButton}
            >
              <Text style={styles.emptyButtonText}>File Your First Complaint</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  listContent: {
    padding: 20,
  },
  complaintFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  category: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '700',
    textTransform: 'capitalize',
    backgroundColor: '#F0F0FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 20,
  },
  emptyButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TrackComplaintsScreen;


