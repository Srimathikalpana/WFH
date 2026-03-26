import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
  ColorValue,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, BorderRadius, Spacing } from '../../../constants/theme';

interface GradientButtonProps {
  label: string;
  onPress: () => void;
  colors?: readonly ColorValue[];
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export default function GradientButton({
  label,
  onPress,
  colors = Colors.gradients.primary,
  style,
  textStyle,
  disabled = false,
  icon,
  size = 'md',
}: GradientButtonProps) {
  const sizeStyles = {
    sm: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg },
    md: { paddingVertical: Spacing.lg, paddingHorizontal: Spacing.xl },
    lg: { paddingVertical: Spacing.xl, paddingHorizontal: Spacing['2xl'] },
  };

  const fontSizeMap = {
    sm: Typography.fontSize.sm,
    md: Typography.fontSize.md,
    lg: Typography.fontSize.lg,
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[{ opacity: disabled ? 0.5 : 1 }, style]}
    >
      <LinearGradient
        colors={colors as [ColorValue, ColorValue, ...ColorValue[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.button,
          sizeStyles[size],
          { borderRadius: BorderRadius.lg },
        ]}
      >
        <View style={styles.content}>
          {icon && <View style={styles.icon}>{icon}</View>}
          <Text
            style={[
              styles.text,
              { fontSize: fontSizeMap[size] },
              textStyle,
            ]}
          >
            {label}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  icon: {
    width: 20,
    height: 20,
  },
  text: {
    color: '#fff',
    fontWeight: Typography.fontWeight.semibold,
    textAlign: 'center',
  },
});
