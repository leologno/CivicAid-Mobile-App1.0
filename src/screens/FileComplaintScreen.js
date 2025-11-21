import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { complaintAPI } from '../services/api';
import Input from '../components/Input';
import Button from '../components/Button';

const FileComplaintScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('infrastructure');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);

  const selectMedia = () => {
    Alert.alert(
      'Select Media',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => openCamera() },
        { text: 'Gallery', onPress: () => openGallery() },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const openCamera = () => {
    launchCamera({ mediaType: 'mixed', quality: 0.8 }, (response) => {
      if (response.assets && response.assets[0]) {
        setMedia([...media, response.assets[0]]);
      }
    });
  };

  const openGallery = () => {
    launchImageLibrary({ mediaType: 'mixed', quality: 0.8, selectionLimit: 5 }, (response) => {
      if (response.assets) {
        setMedia([...media, ...response.assets]);
      }
    });
  };

  const removeMedia = (index) => {
    setMedia(media.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title || !description || !address) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!latitude || !longitude) {
      Alert.alert('Error', 'Please provide location coordinates');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('location', JSON.stringify({
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        address,
      }));

      // Append media files
      media.forEach((file, index) => {
        formData.append('media', {
          uri: file.uri,
          type: file.type || 'image/jpeg',
          name: file.fileName || `media_${index}.jpg`,
        });
      });

      const response = await complaintAPI.create(formData);

      if (response.data.success) {
        Alert.alert('Success', 'Complaint filed successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to file complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>File a Complaint</Text>

        <Input
          label="Title"
          value={title}
          onChangeText={setTitle}
          placeholder="Brief description of the issue"
        />

        <Input
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Detailed description of the complaint"
          multiline
          numberOfLines={4}
        />

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.pickerWrapper}>
            <Picker selectedValue={category} onValueChange={setCategory} style={styles.picker}>
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

        <Input
          label="Address"
          value={address}
          onChangeText={setAddress}
          placeholder="Location address"
        />

        <View style={styles.locationRow}>
          <View style={styles.locationInput}>
            <Input
              label="Latitude"
              value={latitude}
              onChangeText={setLatitude}
              placeholder="e.g., 28.6139"
              keyboardType="numeric"
            />
          </View>
          <View style={[styles.locationInput, styles.locationInputLast]}>
            <Input
              label="Longitude"
              value={longitude}
              onChangeText={setLongitude}
              placeholder="e.g., 77.2090"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.mediaSection}>
          <Text style={styles.label}>Media (Optional)</Text>
          <Button
            title="Add Photos/Videos"
            onPress={selectMedia}
            variant="secondary"
          />
          {media.length > 0 && (
            <View style={styles.mediaList}>
              {media.map((item, index) => (
                <View key={index} style={styles.mediaItem}>
                  <Text style={styles.mediaName}>
                    {item.fileName || `Media ${index + 1}`}
                  </Text>
                  <Button
                    title="Remove"
                    onPress={() => removeMedia(index)}
                    variant="secondary"
                  />
                </View>
              ))}
            </View>
          )}
        </View>

        <Button title="Submit Complaint" onPress={handleSubmit} loading={loading} />
      </ScrollView>
      </KeyboardAvoidingView>
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
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 32,
    letterSpacing: -0.5,
  },
  pickerContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  pickerWrapper: {
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
    overflow: 'hidden',
  },
  picker: {
    height: 52,
  },
  locationRow: {
    flexDirection: 'row',
  },
  locationInput: {
    flex: 1,
    marginRight: 12,
  },
  locationInputLast: {
    marginRight: 0,
  },
  mediaSection: {
    marginBottom: 16,
  },
  mediaList: {
    marginTop: 12,
  },
  mediaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  mediaName: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
});

export default FileComplaintScreen;

