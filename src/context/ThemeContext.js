import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants/theme';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Initial state matching system? Or saved preference.
    // Defaulting to light for now as per design.

    useEffect(() => {
        loadTheme();
    }, []);

    const loadTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem('settings_dark_mode');
            if (savedTheme !== null) {
                setIsDarkMode(JSON.parse(savedTheme));
            }
        } catch (e) {
            console.error('Failed to load theme');
        }
    };

    const toggleTheme = async () => {
        const newVal = !isDarkMode;
        setIsDarkMode(newVal);
        await AsyncStorage.setItem('settings_dark_mode', JSON.stringify(newVal));
    };

    // Define Dark Palette based on existing COLORS but inverted usage
    const darkColors = {
        ...COLORS,
        background: '#0F172A', // Slate 900
        surface: '#1E293B', // Slate 800
        text: '#F1F5F9', // Slate 100
        textSecondary: '#94A3B8', // Slate 400
        textLight: '#64748B', // Slate 500
        border: '#334155', // Slate 700
        inputBg: '#334155', // Slate 700
        // Adjust primary logic if needed, but Sky Blue pops on dark too.
    };

    const theme = {
        isDarkMode,
        toggleTheme,
        colors: isDarkMode ? darkColors : COLORS,
    };

    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
