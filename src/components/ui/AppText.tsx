import React from "react";
import { Text, StyleSheet, TextStyle } from "react-native";
import { tokens } from "../../theme";

interface AppTextProps {
  children: React.ReactNode;
  variant?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  color?: keyof typeof tokens.colors | string;
  weight?: "normal" | "bold" | "600";
  style?: TextStyle;
}

export function AppText({
  children,
  variant = "md",
  color = tokens.colors.gray[900],
  weight = "normal",
  style,
}: AppTextProps) {
  return (
    <Text
      style={[
        styles.base,
        { fontSize: tokens.typography.sizes[variant] },
        { color },
        { fontWeight: weight === "bold" ? "700" : weight === "600" ? "600" : "400" },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: "System",
  },
});
