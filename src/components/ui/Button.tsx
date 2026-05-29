import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({ label, onPress, variant = 'primary', style, textStyle }: ButtonProps) {
  const baseStyle = styles.base;
  const primaryStyle = styles.primary;
  const secondaryStyle = styles.secondary;
  
  const buttonStyle = [baseStyle, variant === 'primary' ? primaryStyle : secondaryStyle, style];
  
  return (
    <Pressable style={buttonStyle} onPress={onPress}>
      <Text style={[styles.text, variant === 'secondary' ? styles.textSecondary : null, textStyle]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: '#3b82f6',
  },
  secondary: {
    backgroundColor: '#e5e7eb',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  textSecondary: {
    color: '#374151',
  },
});
