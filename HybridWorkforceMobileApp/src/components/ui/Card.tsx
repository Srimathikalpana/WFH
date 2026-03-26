import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, BorderRadius, Spacing } from '../../../constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  noPadding?: boolean;
}

export default function Card({ children, style, noPadding = false }: CardProps) {
  return (
    <View
      style={[
        styles.card,
        !noPadding && { padding: Spacing.lg },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background.surface,
    borderColor: Colors.border.default,
    borderWidth: 1,
    borderRadius: BorderRadius['2xl'],
  },
});
