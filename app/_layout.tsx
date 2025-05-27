import "@/global.css";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { StatusBar } from "react-native";
import { ThemeProvider } from '@/components/ThemeContext';
import { Slot, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [appReady, setAppReady] = useState(false);
  const [onboarded, setOnboarded] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Check if user has completed onboarding
        const hasOnboarded = await AsyncStorage.getItem('hasOnboarded');
        setOnboarded(hasOnboarded === 'true');
        
        // Wait for fonts to load
        await SplashScreen.preventAutoHideAsync();
      } catch (e) {
        console.warn(e);
      } finally {
        // Mark app as ready
        setAppReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appReady && loaded) {
      // Hide splash screen
      SplashScreen.hideAsync();
      
      // Navigate to home if onboarded
      if (onboarded) {
        router.replace('/');
      }
    }
  }, [appReady, loaded, onboarded]);

  if (!loaded || !appReady) {
    return null;
  }

  return (
    <ThemeProvider>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <Slot />
    </ThemeProvider>
  );
}