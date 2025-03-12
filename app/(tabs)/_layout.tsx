import { Tabs } from 'expo-router';
import React from 'react';
import { Image } from 'react-native';
const homeIcon = require('@/assets/icons/calendar.png');
export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({color,size}) => (
        <Image source={require('@/assets/icons/user.png')} style={{width: size, height: size, tintColor: color}}/>
      ) }}/>
      <Tabs.Screen name="index" options={{ title: 'Calendar', tabBarIcon: ({color,size}) => (
        <Image source={homeIcon} style={{width: size, height: size, tintColor: color}}/>
      ) }}/>
      
      <Tabs.Screen name="settings" options={{ title: 'Settings', tabBarIcon: ({color, size}) => (
        <Image source={require('@/assets/icons/settings.png')} style={{width: size, height: size, tintColor: color}}/>
      ) }}/>
      
    </Tabs>
  );
}
