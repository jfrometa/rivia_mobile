import React from "react";
import { TouchableOpacity, StyleSheet, ViewStyle, ActivityIndicator } from "react-native";
import { AppText } from "./AppText";
import { tokens } from "../../theme";

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export function AppButton({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  style,
}: AppButtonProps) {
  const isDisabled = disabled || loading;

  const getContainerStyle = () => {
    let baseStyle = [styles.base, style];

    switch (variant) {
      case "primary":
        baseStyle.push(styles.primary);
        break;
      case "secondary":
        baseStyle.push(styles.secondary);
        break;
      case "outline":
        baseStyle.push(styles.outline);
        break;
      case "ghost":
        baseStyle.push(styles.ghost);
        break;
    }

    if (isDisabled) {
      baseStyle.push(styles.disabled);
    }

    return baseStyle;
  };

  const getTextColor = () => {
    if (variant === "outline" || variant === "ghost") {
      return tokens.colors.primary[600];
    }
    return tokens.colors.white;
  };

  return (
    <TouchableOpacity
      style={getContainerStyle()}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <AppText
          variant="md"
          weight="600"
          color={getTextColor()}
        >
          {title}
        </AppText>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.lg,
    borderRadius: tokens.radius.md,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  primary: {
    backgroundColor: tokens.colors.primary[600],
  },
  secondary: {
    backgroundColor: tokens.colors.secondary[600],
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: tokens.colors.primary[600],
  },
  ghost: {
    backgroundColor: "transparent",
  },
  disabled: {
    opacity: 0.5,
  },
});
