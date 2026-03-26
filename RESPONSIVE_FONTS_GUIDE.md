# Responsive & Consistent Fonts Guide

## 🔧 Fixed Issues

✅ **Removed excessive logging** - API configuration logs disabled in api.ts  
✅ **Replaced deprecated SafeAreaView** - Now using `react-native-safe-area-context`  
✅ **Splash screen every time** - Added `isAuthSplashDone` state to show splash on each app launch  
✅ **Font sizes corrected** - Updated Typography.fontSize with proper mobile sizes (12-40px)  
✅ **Fixed icon warning** - Changed "shield-check" → "shield" in LoginScreen  

---

## 📱 How Fonts Are Now Consistent

### 1. **Centralized Typography System** (constants/theme.ts)

All font sizes defined in one place:

```typescript
Typography = {
  fontSize: {
    xs: 12,      // Small text
    sm: 14,      // Small body text
    base: 16,    // Default body text
    md: 18,      // Medium text
    lg: 20,      // Large text
    xl: 24,      // Extra large
    '2xl': 28,   // Heading 2
    '3xl': 32,   // Heading 1
    '4xl': 36,   // Large heading
    '5xl': 40,   // Extra large heading
  },
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: 1.2,    // Tight spacing
    normal: 1.5,   // Default spacing
    relaxed: 1.6,  // Loose spacing
  },
}
```

### 2. **Pre-built Text Styles** (constants/theme.ts)

Use `TextStyles` object for quick styled text:

```typescript
// Instead of:
<Text style={{ fontSize: 36, fontWeight: '600' }}>Heading</Text>

// Use:
<Text style={TextStyles.heading1}>Heading</Text>
```

### 3. **Responsive Font Scaling** (utils/responsiveFont.ts)

For dynamic scaling on different screen sizes:

```typescript
import { useResponsiveFontSize } from '../utils/responsiveFont';

function MyComponent() {
  const { getFontSize, getTypographySizes } = useResponsiveFontSize();
  
  return (
    <Text style={{ fontSize: getFontSize(16) }}>
      This scales with screen size
    </Text>
  );
}
```

---

## 🎨 How to Use Consistent Fonts

### Option 1: Use TextStyles (Recommended)

```typescript
import { TextStyles, Colors } from '../constants/theme';

<Text style={TextStyles.heading1}>Main Title</Text>
<Text style={TextStyles.heading2}>Subtitle</Text>
<Text style={TextStyles.body}>Body text</Text>
<Text style={TextStyles.bodySmall}>Small text</Text>
<Text style={TextStyles.caption}>Caption text</Text>
```

### Option 2: Use Typography Directly

```typescript
import { Typography, Colors } from '../constants/theme';

<Text style={{
  fontSize: Typography.fontSize.lg,
  fontWeight: Typography.fontWeight.semibold,
  lineHeight: Typography.lineHeight.normal,
  color: Colors.text.primary,
}}>
  Custom Text
</Text>
```

### Option 3: Responsive Fonts

```typescript
import { useResponsiveFontSize } from '../utils/responsiveFont';

function DynamicText() {
  const { getFontSize } = useResponsiveFontSize();
  
  return (
    <Text style={{ fontSize: getFontSize(16) }}>
      Auto-scales on any device
    </Text>
  );
}
```

---

## 🖥️ Responsive Layout Patterns

### Make Layouts Responsive with Flex

```typescript
const styles = StyleSheet.create({
  // Use flex for responsive layouts
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: Spacing.xl, // From theme
  },
  
  // Row layout
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  // Flexible items
  item: {
    flex: 1,
    marginHorizontal: Spacing.md,
  },
});
```

### Responsive Spacing

```typescript
import { Spacing } from '../constants/theme';

<View style={{
  paddingHorizontal: Spacing.xl,      // Width-based padding
  marginVertical: Spacing.lg,         // Height-based margin
  gap: Spacing.md,                     // Space between children
}}>
  {/* content */}
</View>
```

### Scale Based on Screen Width

```typescript
import { useWindowDimensions } from 'react-native';

function ResponsiveComponent() {
  const { width, height } = useWindowDimensions();
  
  // Example: Adjust layout for tablets vs phones
  const isTablet = width > 600;
  
  return (
    <View style={{
      flex: 1,
      paddingHorizontal: isTablet ? Spacing['3xl'] : Spacing.xl,
      maxWidth: isTablet ? 800 : undefined,
    }}>
      {/* Content scales with window */}
    </View>
  );
}
```

---

## 📋 Checklist: Apply to All Screens

When creating or updating screens, ensure:

- [ ] All text uses `TextStyles` or `Typography` from theme
- [ ] All colors use `Colors` object
- [ ] All spacing uses `Spacing` constants
- [ ] ScreenWrapper wraps the entire screen
- [ ] No hardcoded font sizes (always use theme)
- [ ] No hardcoded colors (always use Colors object)
- [ ] Use flex layouts instead of fixed widths
- [ ] Test on different screen sizes

### Example Screen Template

```typescript
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, TextStyles } from '../../constants/theme';
import ScreenWrapper from '../components/ui/ScreenWrapper';

export default function MyScreen() {
  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Text style={TextStyles.heading1}>Screen Title</Text>
        <Text style={TextStyles.bodySmall}>Subtitle</Text>
        
        {/* Content */}
        <View style={styles.card}>
          <Text style={TextStyles.body}>Main content</Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginVertical: Spacing.md,
    borderColor: Colors.border.default,
    borderWidth: 1,
  },
});
```

---

## 🚀 Running the App

Now with all fixes applied:

```bash
# Start the app fresh
npm start -- --reset-cache

# The app will:
# 1. Show splash screen every launch
# 2. Display clean console (no excessive logs)
# 3. Show consistent font sizes across all screens
# 4. Scale properly on different devices
```

---

## 🔍 Typography Size Reference

| Usage | Size | Used For |
|-------|------|----------|
| `xs` (12px) | Extra small | Tiny labels, badges |
| `sm` (14px) | Small | Captions, helper text |
| `base` (16px) | Body text | Main content, default |
| `md` (18px) | Medium | Emphasized body text |
| `lg` (20px) | Large | Subheadings |
| `xl` (24px) | Extra large | Large subheadings |
| `2xl` (28px) | 2XL | Section headings |
| `3xl` (32px) | 3XL | Page headings |
| `4xl` (36px) | 4XL | Large headings |
| `5xl` (40px) | 5XL | Hero text |

---

## ✨ Pro Tips

1. **Always use theme constants** - Never hardcode colors, fonts, or spacing
2. **ScreenWrapper everywhere** - All screens should use ScreenWrapper component
3. **Responsive first** - Use flex and percentages, not fixed widths
4. **Test on devices** - Always test on both small and large screens
5. **Use ScrollView for long content** - Prevents content from being cut off

---

## 📚 Related Files

- Theme system: `constants/theme.ts`
- Responsive fonts: `utils/responsiveFont.ts`
- Screen wrapper: `src/components/ui/ScreenWrapper.tsx`
- Auth context: `src/context/AuthContext.tsx`
- Root navigator: `src/navigation/RootNavigator.tsx`
