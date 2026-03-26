/**
 * Cube AI Workforce Manager - Dark Theme Design System
 * Complete color palette, typography, and spacing system
 */

import { Platform } from 'react-native';

// ============= COLORS =============
export const Colors = {
  // Core backgrounds
  background: {
    base: '#0F1117',
    surface: '#141827',
    elevated: '#1A1D27',
  },
  // Borders
  border: {
    default: '#1E2640',
    light: '#252836',
    lighter: '#1E2230',
  },
  // Text colors
  text: {
    primary: '#F1F5F9',
    secondary: '#94A3B8',
    muted: '#64748B',
    hint: '#475569',
  },
  // Accent colors
  accent: {
    blue: '#3B82F6',
    purple: '#7C3AED',
    lightBlue: '#60A5FA',
  },
  // Status colors - success
  success: {
    base: '#4ADE80',
    bg: '#071810',
    border: '#166534',
  },
  // Status colors - warning
  warning: {
    base: '#FBBF24',
    bg: '#1A1200',
    border: '#92400E',
  },
  // Status colors - error
  error: {
    base: '#EF4444',
    bg: '#1A0808',
    border: '#991B1B',
  },
  // Status colors - info
  info: {
    base: '#60A5FA',
    bg: '#0A1A2E',
    border: '#1E3A5F',
  },
  // Additional
  idle: {
    base: '#FBBF24',
    bg: '#120F00',
    border: '#92400E',
  },
  offline: {
    base: '#EF4444',
    bg: '#1A0808',
    border: '#991B1B',
  },
  // UI elements
  navBar: '#13161F',
  navBarBorder: '#1E2230',
  badge: {
    unread: '#3B82F6',
  },
  gradients: {
    primary: ['#2563EB', '#7C3AED'],
    ctaGreen: ['#166534', '#15803D'],
  },
};

// ============= TYPOGRAPHY =============
export const Typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    md: 18,
    lg: 20,
    xl: 24,
    '2xl': 28,
    '3xl': 32,
    '4xl': 36,
    '5xl': 40,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.6,
  },
};

// ============= SPACING =============
export const Spacing = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  '3xl': 32,
};

// ============= BORDER RADIUS =============
export const BorderRadius = {
  sm: 6,
  md: 8,
  lg: 10,
  xl: 12,
  '2xl': 14,
  full: 20,
  pill: 20,
};

// ============= FONTS =============
export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// ============= TEXT STYLES (Readable presets) =============
export const TextStyles = {
  heading1: {
    fontSize: Typography.fontSize['4xl'],
    fontWeight: Typography.fontWeight.semibold,
    lineHeight: Typography.lineHeight.tight,
    color: Colors.text.primary,
  },
  heading2: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.semibold,
    lineHeight: Typography.lineHeight.tight,
    color: Colors.text.primary,
  },
  heading3: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semibold,
    lineHeight: Typography.lineHeight.tight,
    color: Colors.text.primary,
  },
  body: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.regular,
    lineHeight: Typography.lineHeight.normal,
    color: Colors.text.primary,
  },
  bodySmall: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.regular,
    lineHeight: Typography.lineHeight.normal,
    color: Colors.text.secondary,
  },
  label: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    lineHeight: Typography.lineHeight.tight,
    color: Colors.text.hint,
  },
  caption: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    lineHeight: Typography.lineHeight.tight,
    color: Colors.text.muted,
  },
  button: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    lineHeight: Typography.lineHeight.tight,
    color: Colors.text.primary,
  },
};
