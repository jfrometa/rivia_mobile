import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { AppText } from "./AppText";
import { tokens } from "../../theme";

interface LoadingStateProps {
  text?: string;
}

export function LoadingState({ text = "Cargando..." }: LoadingStateProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={tokens.colors.primary[600]} />
      {text && <AppText style={styles.text}>{text}</AppText>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: tokens.spacing.xl,
  },
  text: {
    marginTop: tokens.spacing.md,
    color: tokens.colors.gray[600],
  },
});
