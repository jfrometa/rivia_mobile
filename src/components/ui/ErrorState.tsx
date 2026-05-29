import React from "react";
import { View, StyleSheet } from "react-native";
import { AppText } from "./AppText";
import { AppButton } from "./AppButton";
import { tokens } from "../../theme";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = "Ocurrió un error", onRetry }: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <AppText variant="lg" weight="bold" color={tokens.colors.error[600]} style={styles.text}>
        {message}
      </AppText>
      {onRetry && <AppButton title="Reintentar" onPress={onRetry} style={styles.button} />}
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
    textAlign: "center",
    marginBottom: tokens.spacing.md,
  },
  button: {
    minWidth: 150,
  },
});
