import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, Pressable, Image, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, Image as ImageIcon, Trash2, CheckCircle2 } from 'lucide-react-native';
import { useAppraisalWizardStore } from '../../src/features/appraisal/store/useAppraisalWizardStore';
import { Button } from '../../src/components/ui/Button';

const mockPhotoOptions = [
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=400&q=80',
];

export default function Step3Photos() {
  const router = useRouter();
  const store = useAppraisalWizardStore();

  const [photos, setPhotos] = useState<string[]>(store.photos);

  const handleCapturePhoto = () => {
    const nextPhoto = mockPhotoOptions[photos.length % mockPhotoOptions.length];
    const updated = [...photos, nextPhoto];
    setPhotos(updated);
    store.updateField('photos', updated);
  };

  const handleRemovePhoto = (index: number) => {
    const updated = photos.filter((_, idx) => idx !== index);
    setPhotos(updated);
    store.updateField('photos', updated);
  };

  const handleNext = () => {
    if (photos.length < 1) {
      Alert.alert('Validation Error', 'At least one physical asset photo is required to submit the appraisal.');
      return;
    }

    store.updateField('currentStepIndex', 3);
    router.push('/valuation/step4-review');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.description}>
          Capture physical asset conditions, facade elements, and access pathways.
        </Text>

        <View style={styles.counterContainer}>
          <Text style={styles.counterLabel}>Photos Registered</Text>
          <View style={styles.counterValueContainer}>
            {photos.length > 0 && <CheckCircle2 size={16} color="#22c55e" style={styles.successIcon} />}
            <Text style={[styles.counterValue, { color: photos.length > 0 ? '#22c55e' : '#3b82f6' }]}>
              {photos.length}
            </Text>
          </View>
        </View>

        <Pressable style={styles.captureButton} onPress={handleCapturePhoto}>
          <Camera size={38} color="#3b82f6" style={styles.captureIcon} />
          <Text style={styles.captureText}>Capture Real Estate Photo</Text>
          <Text style={styles.captureSubtext}>Simulates device physical camera trigger</Text>
        </Pressable>

        <View style={styles.galleryContainer}>
          {photos.map((photo, idx) => (
            <View key={idx} style={styles.galleryItem}>
              <View style={styles.photoContainer}>
                <Image source={{ uri: photo }} style={styles.photo} />
                <Pressable
                  style={styles.deleteButton}
                  onPress={() => handleRemovePhoto(idx)}
                >
                  <Trash2 size={14} color="#ef4444" />
                </Pressable>
              </View>
            </View>
          ))}
          {photos.length === 0 && (
            <View style={styles.emptyStateContainer}>
              <ImageIcon size={32} color="#9ca3af" style={styles.emptyIcon} />
              <Text style={styles.emptyText}>No visual evidence recorded yet</Text>
            </View>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <Button
            label="Back"
            variant="secondary"
            onPress={() => router.back()}
            style={{ flex: 1 }}
          />
          <Button
            label="Save & Review"
            onPress={handleNext}
            style={{ flex: 1 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  description: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  counterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 8,
  },
  counterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  counterValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  successIcon: {
    marginRight: 6,
  },
  counterValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  captureButton: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#e5e7eb',
    borderRadius: 16,
    height: 176,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
    marginBottom: 8,
  },
  captureIcon: {
    marginBottom: 8,
  },
  captureText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  captureSubtext: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  galleryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  galleryItem: {
    width: '50%',
    padding: 6,
  },
  photoContainer: {
    position: 'relative',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    overflow: 'hidden',
    height: 128,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  deleteButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    borderRadius: 999,
  },
  emptyStateContainer: {
    width: '100%',
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyIcon: {
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9ca3af',
    textAlign: 'center',
  },
  buttonContainer: {
    paddingTop: 32,
    flexDirection: 'row',
    gap: 16,
    paddingBottom: 32,
  },
});
