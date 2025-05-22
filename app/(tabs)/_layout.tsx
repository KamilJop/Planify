// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import React from 'react';
import { Image } from 'react-native';
import { useTheme } from '@/components/ThemeContext';

const TabLayoutWrapper = () => {

  const { colors } = useTheme();

  const homeIcon = require('@/assets/icons/calendar.png');
  const userIcon = require('@/assets/icons/user.png');
  const settingsIcon = require('@/assets/icons/settings.png');

  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false, 
        tabBarStyle: { 
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 60,
          backgroundColor: colors.surface,
          borderTopWidth: 0,
          elevation: 0,
        }, 
        tabBarLabelStyle: { 
          fontSize: 12,
          marginBottom: 4,
        }, 
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.onSurface,
      }}
    >
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: 'Profile', 
          tabBarIcon: ({ color, size }) => (
            <Image 
              source={userIcon} 
              style={{
                width: size, 
                height: size, 
                tintColor: color
              }}
            />
          ) 
        }}
      />
      
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Calendar', 
          tabBarIcon: ({ color, size }) => (
            <Image 
              source={homeIcon} 
              style={{
                width: size, 
                height: size, 
                tintColor: color
              }}
            />
          ) 
        }}
      />
      
      <Tabs.Screen 
        name="settings" 
        options={{ 
          title: 'Settings', 
          tabBarIcon: ({ color, size }) => (
            <Image 
              source={settingsIcon} 
              style={{
                width: size, 
                height: size, 
                tintColor: color
              }}
            />
          ) 
        }}
      />
    </Tabs>
  );
};

export default TabLayoutWrapper;