// ... imports including TextInput
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  TextInput, // Added TextInput
} from 'react-native';
// ... other imports
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../constants/theme'; // Import theme

const AttachMediaScreen = ({ route, navigation }) => {
  const { complaintId, isProof } = route.params || {}; // Get isProof flag
  const [media, setMedia] = useState([]);
  const [note, setNote] = useState(''); // State for proof note
  const [loading, setLoading] = useState(false);

  // ... selectMedia, openCamera, openGallery, removeMedia functions stay same ...

  const handleUpload = async () => {
    if (media.length === 0) {
      Alert.alert('Error', 'Please select at least one media file (photo/video)');
      return;
    }

    if (isProof && !note.trim()) {
      Alert.alert('Error', 'Please add a note describing the work done.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      // Add text fields if proof
      if (isProof) {
        formData.append('note', note);
      }

      media.forEach((file, index) => {
        formData.append('media', {
          uri: file.uri,
          type: file.type || 'image/jpeg',
          name: file.fileName || `media_${index}.jpg`,
        });
      });

      // Choose API endpoint based on type
      const response = await (isProof
        ? complaintAPI.submitProof(complaintId, formData)
        : complaintAPI.uploadMedia(complaintId, formData));

      if (response.data.success) {
        Alert.alert('Success', isProof ? 'Proof submitted successfully!' : 'Media uploaded successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to upload');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{isProof ? 'Submit Proof of Work' : 'Attach Media'}</Text>

        {isProof && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description of Work</Text>
            <TextInput
              style={styles.input}
              placeholder="Describe what was done..."
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        )}

        <Button
          title={isProof ? "Taken Photo/Video" : "Add Photos/Videos"}
          onPress={selectMedia}
          variant="secondary"
        />

        {/* ... media preview logic ... */}
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
  inputContainer: {
    marginBottom: SPACING.l,
  },
  label: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.s,
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: BORDER_RADIUS.m,
    padding: SPACING.m,
    fontSize: 14,
    color: COLORS.text,
  },
  videoText: {
    fontSize: 16,
    color: '#666',
  },
});

export default AttachMediaScreen;


