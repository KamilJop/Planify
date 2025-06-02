import "@/global.css";
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import { StatusBar } from "react-native";
import { ThemeProvider } from '@/components/ThemeContext';
import { Slot } from 'expo-router';


export default function RootLayout() {


  return (
    <ThemeProvider>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <Slot />
    </ThemeProvider>
  );
}