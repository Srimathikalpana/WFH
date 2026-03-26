import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '../../../constants/theme';

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  noPadding?: boolean;
  noPaddingTop?: boolean;
  noPaddingBottom?: boolean;
  padding?: number;
}

export default function ScreenWrapper({
  children,
  style,
  noPadding = false,
  noPaddingTop = false,
  noPaddingBottom = false,
  padding,
}: ScreenWrapperProps) {
  const getPaddingStyles = () => {
    if (noPadding) return {};
    if (padding !== undefined) {
      return {
        paddingHorizontal: padding,
        paddingTop: noPaddingTop ? 0 : padding,
        paddingBottom: noPaddingBottom ? 0 : padding,
      };
    }
    return {
      paddingHorizontal: Spacing.xl,
      paddingTop: noPaddingTop ? 0 : Spacing.xl,
      paddingBottom: noPaddingBottom ? 0 : Spacing.xl,
    };
  };

  return (
    <SafeAreaView style={[styles.container, style]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background.base} />
      <View style={[styles.content, getPaddingStyles()]}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.base,
  },
  content: {
    flex: 1,
  },
});
