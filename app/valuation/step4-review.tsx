import React from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppraisalWizardStore } from '../../src/features/appraisal/store/useAppraisalWizardStore';
import { Button } from '../../src/components/ui/Button';

export default function Step4Review() {
  const router = useRouter();
  const store = useAppraisalWizardStore();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', padding: 16 }}>
      <ScrollView>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
          Review Appraisal
        </Text>
        <Text style={{ fontSize: 16, marginBottom: 8 }}>
          Photos: {store.photos.length}
        </Text>
        <View style={{ marginTop: 32, flexDirection: 'row', gap: 16 }}>
          <Button
            label="Back"
            variant="secondary"
            onPress={() => router.back()}
            style={{ flex: 1 }}
          />
          <Button
            label="Submit"
            onPress={() => {
              console.log('Appraisal submitted!');
            }}
            style={{ flex: 1 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
