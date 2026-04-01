import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView, Edges } from 'react-native-safe-area-context';
import { Colors, Spacing } from '../../../constants/theme';

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  noPadding?: boolean;
  noPaddingTop?: boolean;
  noPaddingBottom?: boolean;
  padding?: number;
  edges?: Edges;
}

export default function ScreenWrapper({
  children,
  style,
  noPadding = false,
  noPaddingTop = false,
  noPaddingBottom = false,
  padding,
  edges, // Default to all edges
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
    <SafeAreaView edges={edges} style={[styles.container, style]}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="transparent" 
        translucent 
      />
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
