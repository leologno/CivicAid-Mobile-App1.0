import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { adminAPI } from '../services/api';
import Card from '../components/Card';

const AdminReportsScreen = ({ navigation }) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    loadReports();
  }, [category, status]);

  const loadReports = async () => {
    try {
      const params = {};
      if (category) params.category = category;
      if (status) params.status = status;

      const response = await adminAPI.getReports(params);
      if (response.data.success) {
        setComplaints(response.data.data);
      }
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadReports();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
      <View style={styles.content}>
        <Text style={styles.title}>Complaint Reports</Text>

        <View style={styles.filters}>
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Category</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={category}
                onValueChange={setCategory}
                style={styles.picker}
              >
                <Picker.Item label="All Categories" value="" />
                <Picker.Item label="Infrastructure" value="infrastructure" />
                <Picker.Item label="Sanitation" value="sanitation" />
                <Picker.Item label="Safety" value="safety" />
                <Picker.Item label="Environment" value="environment" />
                <Picker.Item label="Health" value="health" />
                <Picker.Item label="Education" value="education" />
                <Picker.Item label="Transport" value="transport" />
                <Picker.Item label="Other" value="other" />
              </Picker>
            </View>
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Status</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={status}
                onValueChange={setStatus}
                style={styles.picker}
              >
                <Picker.Item label="All Statuses" value="" />
                <Picker.Item label="Pending" value="pending" />
                <Picker.Item label="Assigned" value="assigned" />
                <Picker.Item label="In Progress" value="in_progress" />
                <Picker.Item label="Resolved" value="resolved" />
                <Picker.Item label="Rejected" value="rejected" />
              </Picker>
            </View>
          </View>
        </View>

        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            Total Complaints: {complaints.length}
          </Text>
        </View>

        {complaints.map((complaint) => (
          <Card
            key={complaint._id}
            title={complaint.title}
            description={complaint.description}
            status={complaint.status}
            onPress={() => navigation.navigate('ComplaintDetails', { id: complaint._id })}
          >
            <View style={styles.complaintFooter}>
              <Text style={styles.category}>{complaint.category}</Text>
              <Text style={styles.date}>{formatDate(complaint.createdAt)}</Text>
            </View>
            {complaint.user && (
              <Text style={styles.userInfo}>
                By: {complaint.user.name} ({complaint.user.email})
              </Text>
            )}
          </Card>
        ))}
      </View>
      </ScrollView>
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
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  filters: {
    marginBottom: 20,
  },
  filterGroup: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    backgroundColor: '#FFF',
  },
  picker: {
    height: 50,
  },
  summary: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
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
    color: '#007AFF',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  userInfo: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
});

export default AdminReportsScreen;

