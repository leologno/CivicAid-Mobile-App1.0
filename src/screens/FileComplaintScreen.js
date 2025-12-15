import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { complaintAPI } from '../services/api';
import Input from '../components/Input';
import Button from '../components/Button';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../constants/theme';

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

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission to access camera is required!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 0.8,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      setMedia([...media, result.assets[0]]);
    }
  };

  const openGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 0.8,
      allowsMultipleSelection: true,
      selectionLimit: 5,
    });

    if (!result.canceled && result.assets) {
      // Filter out duplicates if needed, or just append
      setMedia([...media, ...result.assets]);
    }
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
    <LinearGradient
      colors={COLORS.gradients.background}
      style={styles.safeArea}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
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

            <View style={styles.locationSection}>
              <Text style={styles.label}>Location</Text>

              <Button
                title="📍 Get Current Location"
                onPress={async () => {
                  let { status } = await Location.requestForegroundPermissionsAsync();
                  if (status !== 'granted') {
                    Alert.alert('Permission to access location was denied');
                    return;
                  }

                  setLoading(true);
                  try {
                    let location = await Location.getCurrentPositionAsync({});
                    setLatitude(location.coords.latitude.toString());
                    setLongitude(location.coords.longitude.toString());
                  } catch (error) {
                    Alert.alert('Error', 'Could not fetch location');
                  } finally {
                    setLoading(false);
                  }
                }}
                variant="secondary"
                style={{ marginBottom: SPACING.m }}
              />

              <View style={styles.mapContainer}>
                <MapView
                  style={styles.map}
                  region={{
                    latitude: parseFloat(latitude) || 23.8103, // Default to Dhaka
                    longitude: parseFloat(longitude) || 90.4125,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                  onPress={(e) => {
                    setLatitude(e.nativeEvent.coordinate.latitude.toString());
                    setLongitude(e.nativeEvent.coordinate.longitude.toString());
                  }}
                >
                  {latitude && longitude && (
                    <Marker
                      coordinate={{
                        latitude: parseFloat(latitude),
                        longitude: parseFloat(longitude),
                      }}
                      draggable
                      onDragEnd={(e) => {
                        setLatitude(e.nativeEvent.coordinate.latitude.toString());
                        setLongitude(e.nativeEvent.coordinate.longitude.toString());
                      }}
                    />
                  )}
                </MapView>
                {!latitude && (
                  <View style={styles.mapOverlay}>
                    <Text style={styles.mapOverlayText}>Tap map to select location</Text>
                  </View>
                )}
              </View>

              <Text style={styles.coordText}>
                {latitude && longitude ? `${parseFloat(latitude).toFixed(4)}, ${parseFloat(longitude).toFixed(4)}` : 'No location selected'}
              </Text>
            </View>

            <View style={styles.mediaSection}>
              <Text style={styles.label}>Media (Optional)</Text>
              <Button
                title="Add Photos/Videos"
                onPress={selectMedia}
                variant="secondary"
                style={styles.mediaButton}
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
                        style={styles.removeButton}
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
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.l,
  },
  title: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
    marginBottom: SPACING.xl,
  },
  pickerContainer: {
    marginBottom: SPACING.m,
  },
  label: {
    ...TYPOGRAPHY.body,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.s,
  },
  pickerWrapper: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.m,
    backgroundColor: COLORS.inputBg,
    overflow: 'hidden',
  },
  picker: {
    height: 52,
  },
  locationSection: {
    marginBottom: SPACING.l,
  },
  mapContainer: {
    height: 200,
    borderRadius: BORDER_RADIUS.m,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.inputBg,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  mapOverlayText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
    color: COLORS.text,
    backgroundColor: 'rgba(255,255,255,0.7)',
    padding: SPACING.xs,
    borderRadius: BORDER_RADIUS.s,
  },
  coordText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  mediaSection: {
    marginBottom: SPACING.l,
  },
  mediaButton: {
    marginTop: SPACING.xs,
  },
  mediaList: {
    marginTop: SPACING.m,
  },
  mediaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.m,
    borderRadius: BORDER_RADIUS.m,
    marginBottom: SPACING.s,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  mediaName: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    marginRight: SPACING.s,
  },
  removeButton: {
    minHeight: 36,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});

export default FileComplaintScreen;

