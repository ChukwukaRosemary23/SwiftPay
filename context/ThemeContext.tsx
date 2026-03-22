import React, { createContext, useState, useContext, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: {
    background: string;
    card: string;
    text: string;
    subtext: string;
    border: string;
    primary: string;
    success: string;
    danger: string;
    warning: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const lightColors = {
    background: '#F9FAFB',
    card: '#FFFFFF',
    text: '#111827',
    subtext: '#6B7280',
    border: '#E5E7EB',
    primary: '#4F46E5',
    success: '#10B981',
    danger: '#EF4444',
    warning: '#F59E0B',
  };

  const darkColors = {
    background: '#111827',
    card: '#1F2937',
    text: '#F9FAFB',
    subtext: '#9CA3AF',
    border: '#374151',
    primary: '#818CF8',
    success: '#34D399',
    danger: '#F87171',
    warning: '#FBBF24',
  };

  const colors = theme === 'light' ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};