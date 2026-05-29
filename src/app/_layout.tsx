import { Stack } from "expo-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient, setupReactQuery, useReactQueryFocusManager } from "../lib/query-client";
import { AuthProvider } from "../services/auth/AuthProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';


setupReactQuery();

export default function RootLayout() {
  useReactQueryFocusManager();
    useEffect(() => {
    // Sets the background color of the native root view
    SystemUI.setBackgroundColorAsync("#ffffff");
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </AuthProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
