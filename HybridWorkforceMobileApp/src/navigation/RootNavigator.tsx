import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import SplashScreen from '../screens/SplashScreen';
import MainTabNavigator from './MainTabNavigator';
import ChatRoomScreen from '../screens/ChatRoomScreen';
import AttendanceHistoryScreen from '../screens/AttendanceHistoryScreen';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Main: undefined;
  ChatRoom: { conversationId: string; title?: string };
  AttendanceHistory: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { status, isAuthSplashDone } = useAuth();

  // Show loading indicator while checking auth status
  if (status === 'loading') {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthSplashDone ? (
        // Always show splash first
        <Stack.Screen 
          name="Splash" 
          component={SplashScreen} 
          options={{ animationEnabled: false }}
        />
      ) : status !== 'authenticated' ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabNavigator} />
          <Stack.Screen 
            name="ChatRoom" 
            component={ChatRoomScreen} 
            options={{ title: 'Chat', headerShown: true }}
          />
          <Stack.Screen
            name="AttendanceHistory"
            component={AttendanceHistoryScreen}
            options={{ title: 'Attendance History', headerShown: true }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

