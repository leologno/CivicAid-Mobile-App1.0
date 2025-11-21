import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { complaintAPI } from '../services/api';
import Button from '../components/Button';

const AttachMediaScreen = ({ route, navigation }) => {
  const { complaintId } = route.params;
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

  const handleUpload = async () => {
    if (media.length === 0) {
      Alert.alert('Error', 'Please select at least one media file');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      media.forEach((file, index) => {
        formData.append('media', {
          uri: file.uri,
          type: file.type || 'image/jpeg',
          name: file.fileName || `media_${index}.jpg`,
        });
      });

      const response = await complaintAPI.uploadMedia(complaintId, formData);

      if (response.data.success) {
        Alert.alert('Success', 'Media uploaded successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to upload media');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Attach Media</Text>

        <Button
          title="Add Photos/Videos"
          onPress={selectMedia}
          variant="secondary"
        />

        {media.length > 0 && (
          <View style={styles.mediaContainer}>
            {media.map((item, index) => (
              <View key={index} style={styles.mediaItem}>
                {item.type?.startsWith('image') ? (
                  <Image source={{ uri: item.uri }} style={styles.mediaPreview} />
                ) : (
                  <View style={styles.videoPlaceholder}>
                    <Text style={styles.videoText}>Video</Text>
                  </View>
                )}
                <Button
                  title="Remove"
                  onPress={() => removeMedia(index)}
                  variant="secondary"
                />
              </View>
            ))}
          </View>
        )}

        <Button
          title="Upload Media"
          onPress={handleUpload}
          loading={loading}
          disabled={media.length === 0}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
    marginBottom: 24,
  },
  mediaContainer: {
    marginTop: 20,
  },
  mediaItem: {
    marginBottom: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
  },
  mediaPreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  videoPlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#E5E5E5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  videoText: {
    fontSize: 16,
    color: '#666',
  },
});

export default AttachMediaScreen;


