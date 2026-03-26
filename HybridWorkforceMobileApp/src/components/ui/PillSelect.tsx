import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  FlatList,
} from 'react-native';
import { Colors, Typography, BorderRadius, Spacing } from '../../../constants/theme';

type PillVariant = 'success' | 'warning' | 'error' | 'info' | 'default';

interface PillOption {
  id: string;
  label: string;
  variant?: PillVariant;
  icon?: React.ReactNode;
}

interface PillSelectProps {
  options: PillOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  multiSelect?: boolean;
  style?: ViewStyle;
}

const getVariantColors = (variant?: PillVariant) => {
  const variants = {
    success: { bg: Colors.success.bg, border: Colors.success.border, text: Colors.success.base },
    warning: { bg: Colors.warning.bg, border: Colors.warning.border, text: Colors.warning.base },
    error: { bg: Colors.error.bg, border: Colors.error.border, text: Colors.error.base },
    info: { bg: Colors.info.bg, border: Colors.info.border, text: Colors.info.base },
    default: { bg: Colors.background.surface, border: Colors.border.default, text: Colors.text.secondary },
  };
  return variants[variant || 'default'];
};

export default function PillSelect({
  options,
  selectedId,
  onSelect,
  multiSelect = false,
  style,
}: PillSelectProps) {
  const renderPill = ({ item }: { item: PillOption }) => {
    const isSelected = selectedId === item.id;
    const colors = getVariantColors(item.variant);

    return (
      <TouchableOpacity
        onPress={() => onSelect(item.id)}
        activeOpacity={0.7}
        style={[
          styles.pill,
          {
            backgroundColor: isSelected ? colors.bg : Colors.background.surface,
            borderColor: isSelected ? colors.border : Colors.border.default,
            borderWidth: isSelected ? 2 : 1,
          },
        ]}
      >
        {item.icon && <View style={styles.icon}>{item.icon}</View>}
        <Text
          style={[
            styles.text,
            {
              color: isSelected ? colors.text : Colors.text.muted,
              fontWeight: isSelected ? Typography.fontWeight.medium : Typography.fontWeight.regular,
            },
          ]}
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={options}
      renderItem={renderPill}
      keyExtractor={(item) => item.id}
      horizontal
      scrollEnabled={false}
      style={[styles.container, style]}
      contentContainerStyle={styles.contentContainer}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
  },
  contentContainer: {
    gap: Spacing.sm,
  },
  pill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    minHeight: 44,
  },
  icon: {
    width: 12,
    height: 12,
    borderRadius: BorderRadius.full,
  },
  text: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.regular,
  },
});
