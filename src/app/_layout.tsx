import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../store";
import { AuthProvider } from "../services/auth/AuthProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';


export default function RootLayout() {
  useEffect(() => {
    // Sets the background color of the native root view
    SystemUI.setBackgroundColorAsync("#ffffff");
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <AuthProvider>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </AuthProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
