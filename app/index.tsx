import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Rivia Tasaciones
      </Text>
      <Pressable
        onPress={() => router.push('/valuation/step3-photos')}
        style={{ backgroundColor: '#3b82f6', padding: 16, borderRadius: 8 }}
      >
        <Text style={{ color: '#fff', fontWeight: '600' }}>Go to Step 3</Text>
      </Pressable>
    </View>
  );
}
