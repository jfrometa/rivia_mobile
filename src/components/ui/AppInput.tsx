import React from "react";
import { TextInput, StyleSheet, View, TextInputProps } from "react-native";
import { AppText } from "./AppText";
import { tokens } from "../../theme";

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function AppInput({ label, error, style, ...props }: AppInputProps) {
  return (
    <View style={styles.container}>
      {label && <AppText variant="sm" style={styles.label}>{label}</AppText>}
      <TextInput
        style={[styles.input, error ? styles.inputError : null, style]}
        placeholderTextColor={tokens.colors.gray[400]}
        {...props}
      />
      {error && <AppText variant="xs" color={tokens.colors.error[600]} style={styles.error}>{error}</AppText>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: tokens.spacing.md,
  },
  label: {
    marginBottom: tokens.spacing.xs,
    color: tokens.colors.gray[700],
  },
  input: {
    backgroundColor: tokens.colors.white,
    borderWidth: 1,
    borderColor: tokens.colors.gray[300],
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    fontSize: tokens.typography.sizes.md,
    color: tokens.colors.gray[900],
  },
  inputError: {
    borderColor: tokens.colors.error[500],
  },
  error: {
    marginTop: tokens.spacing.xs,
  },
});
