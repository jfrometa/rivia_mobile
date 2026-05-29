import React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { tokens } from "../../theme";

interface ScreenProps {
  children: React.ReactNode;
  style?: View["props"]["style"];
}

export function Screen({ children, style }: ScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.colors.gray[50],
  },
  container: {
    flex: 1,
    padding: tokens.spacing.md,
  },
});
