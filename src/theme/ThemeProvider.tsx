import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

import { AppTheme, darkTheme, lightTheme, ThemeMode } from '.';

const THEME_STORAGE_KEY = 'meditaskpro.theme';

interface ThemeContextValue {
  theme: AppTheme;
  mode: ThemeMode;
  ready: boolean;
  setMode: (mode: ThemeMode) => Promise<void>;
  toggleMode: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>(systemScheme === 'dark' ? 'dark' : 'light');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const loadStoredMode = async () => {
      try {
        const storedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (storedMode === 'light' || storedMode === 'dark') {
          setModeState(storedMode);
        }
      } finally {
        setReady(true);
      }
    };

    loadStoredMode();
  }, []);

  const setMode = async (nextMode: ThemeMode) => {
    setModeState(nextMode);
    await AsyncStorage.setItem(THEME_STORAGE_KEY, nextMode);
  };

  const toggleMode = async () => {
    await setMode(mode === 'dark' ? 'light' : 'dark');
  };

  const value = useMemo(
    () => ({
      theme: mode === 'dark' ? darkTheme : lightTheme,
      mode,
      ready,
      setMode,
      toggleMode
    }),
    [mode, ready]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useThemeContext must be used within ThemeProvider.');
  }

  return context;
};

export const useAppTheme = () => useThemeContext().theme;
