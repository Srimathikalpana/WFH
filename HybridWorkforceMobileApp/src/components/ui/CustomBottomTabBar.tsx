import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Platform,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { Colors, Typography, BorderRadius, Spacing } from '../../../constants/theme';

const getIcon = (name: string, focused: boolean) => {
  const color = focused ? Colors.accent.blue : Colors.text.hint;
  const size = 20;

  const iconMap: Record<string, keyof typeof Feather.glyphMap> = {
    Dashboard: 'grid',
    Attendance: 'clock',
    Leave: 'calendar',
    Alerts: 'bell',
    Profile: 'user',
  };

  return <Feather name={iconMap[name] || 'home'} size={size} color={color} />;
};

export default function CustomBottomTabBar({
  navigation,
  state,
  descriptors,
}: BottomTabBarProps) {
  const focusedOptions = descriptors[state.routes[state.index].key].options;

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          // Map route names to display names
          const displayNames: Record<string, string> = {
            Dashboard: 'Dashboard',
            Attendance: 'Attendance',
            Leave: 'Leave',
            Alerts: 'Alerts',
            Profile: 'Profile',
          };

          const displayName = displayNames[route.name] || route.name;

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabItem}
              activeOpacity={0.7}
            >
              <View style={styles.tabContent}>
                {getIcon(displayName, isFocused)}
                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color: isFocused ? Colors.accent.blue : Colors.text.hint,
                    },
                  ]}
                >
                  {displayName}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.base,
    borderTopColor: Colors.navBarBorder,
    borderTopWidth: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.navBar,
    borderTopColor: Colors.navBarBorder,
    borderTopWidth: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? Spacing.md : Spacing.sm,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  tabLabel: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    marginTop: 2,
  },
});
