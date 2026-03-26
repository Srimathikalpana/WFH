import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors, Typography, BorderRadius, Spacing } from '../../../constants/theme';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'idle' | 'offline' | 'default';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const getVariantColors = (variant: BadgeVariant) => {
  const variants = {
    success: { bg: Colors.success.bg, border: Colors.success.border, text: Colors.success.base },
    warning: { bg: Colors.warning.bg, border: Colors.warning.border, text: Colors.warning.base },
    error: { bg: Colors.error.bg, border: Colors.error.border, text: Colors.error.base },
    info: { bg: Colors.info.bg, border: Colors.info.border, text: Colors.info.base },
    idle: { bg: Colors.idle.bg, border: Colors.idle.border, text: Colors.idle.base },
    offline: { bg: Colors.offline.bg, border: Colors.offline.border, text: Colors.offline.base },
    default: { bg: Colors.background.elevated, border: Colors.border.light, text: Colors.text.secondary },
  };
  return variants[variant] || variants.default;
};

const getSizeStyles = (size: BadgeSize) => {
  const sizes = {
    sm: {
      paddingVertical: Spacing.xs,
      paddingHorizontal: Spacing.sm,
      fontSize: Typography.fontSize.xs,
    },
    md: {
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.md,
      fontSize: Typography.fontSize.sm,
    },
    lg: {
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
      fontSize: Typography.fontSize.base,
    },
  };
  return sizes[size];
};

export default function Badge({
  label,
  variant = 'default',
  size = 'md',
  icon,
  style,
  textStyle,
}: BadgeProps) {
  const colors = getVariantColors(variant);
  const sizeStyles = getSizeStyles(size);

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: colors.bg,
          borderColor: colors.border,
          ...sizeStyles,
        },
        style,
      ]}
    >
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text
        style={[
          {
            color: colors.text,
            fontSize: sizeStyles.fontSize,
          },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
  },
  icon: {
    width: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
