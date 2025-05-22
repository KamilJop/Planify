// contexts/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ColorSchemeName } from 'react-native';
import * as SecureStore from 'expo-secure-store';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  accent: string;
  setAccent: (color: string) => void;
  colors: {
    background: string;
    surface: string;
    lighterSurface: string;
    primary: string;
    primaryVariant: string;
    secondary: string;
    error: string;
    onBackground: string;
    onSurface: string;
    onPrimary: string;
    onSecondary: string;
    onError: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const colorSchemes = {
  dark: {
    background: '#121212',
    surface: '#1E1E1E',
    lighterSurface: '#2A2A2A',
    primary: '#BB86FC',
    primaryVariant: '#3700B3',
    secondary: '#03DAC6',
    error: '#CF6679',
    onBackground: '#FFFFFF',
    onSurface: '#FFFFFF',
    onPrimary: '#000000',
    onSecondary: '#000000',
    onError: '#000000',
  },
  light: {
    background: '#FFFFFF',
    surface: '#F5F5F5',
    lighterSurface: '#FAFAFA',
    primary: '#6200EE',
    primaryVariant: '#3700B3',
    secondary: '#03DAC6',
    error: '#B00020',
    onBackground: '#000000',
    onSurface: '#000000',
    onPrimary: '#FFFFFF',
    onSecondary: '#000000',
    onError: '#FFFFFF',
  },
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [accent, setAccent] = useState<string>('#a258d6');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedTheme = await SecureStore.getItemAsync('theme');
        const savedAccent = await SecureStore.getItemAsync('accent');
        if (savedTheme === 'light' || savedTheme === 'dark') {
          setTheme(savedTheme);
        }
        if (savedAccent) {
          setAccent(savedAccent);
        }
      } catch (e) {
        console.error('Failed to load settings', e);
      }
    };
    loadSettings();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    try {
      await SecureStore.setItemAsync('theme', newTheme);
    } catch (e) {
      console.error('Failed to save theme', e);
    }
  };

  const handleSetAccent = async (color: string) => {
    setAccent(color);
    try {
      await SecureStore.setItemAsync('accent', color);
    } catch (e) {
      console.error('Failed to save accent color', e);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        accent,
        setAccent: handleSetAccent,
        colors: colorSchemes[theme],
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
