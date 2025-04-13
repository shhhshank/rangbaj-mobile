import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  currentTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  colors: {
    background: string;
    card: string;
    text: string;
    border: string;
    primary: string;
    secondary: string;
    success: string;
    error: string;
    warning: string;
    info: string;
    grey1: string;
    grey2: string;
    grey3: string;
  };
}

const darkColors = {
  background: '#121212',
  card: '#1E1E1E',
  text: '#FFFFFF',
  border: 'rgba(255,255,255,0.2)',
  primary: '#00BFA5',
  secondary: '#00796B',
  success: '#4CAF50',
  error: '#FF4B55',
  warning: '#FFC107',
  info: '#2196F3',
  grey1: 'rgba(255,255,255,0.8)',
  grey2: 'rgba(255,255,255,0.6)',
  grey3: 'rgba(255,255,255,0.4)',
};

const lightColors = {
  background: '#F5F5F5',
  card: '#FFFFFF',
  text: '#121212',
  border: 'rgba(0,0,0,0.1)',
  primary: '#00BFA5',
  secondary: '#00796B',
  success: '#4CAF50',
  error: '#FF4B55',
  warning: '#FFC107',
  info: '#2196F3',
  grey1: 'rgba(0,0,0,0.8)',
  grey2: 'rgba(0,0,0,0.6)',
  grey3: 'rgba(0,0,0,0.4)',
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  currentTheme: 'dark',
  setTheme: () => {},
  colors: darkColors,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('system');
  const [systemTheme, setSystemTheme] = useState<ColorSchemeName>(Appearance.getColorScheme());
  
  // Listen for system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemTheme(colorScheme);
    });
    
    return () => {
      subscription.remove();
    };
  }, []);
  
  // Determine the current theme based on user preference or system
  const currentTheme = theme === 'system' 
    ? (systemTheme === 'light' ? 'light' : 'dark')
    : theme;
  
  // Get the appropriate color scheme
  const colors = currentTheme === 'light' ? lightColors : darkColors;
  
  const value = {
    theme,
    currentTheme,
    setTheme,
    colors,
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
