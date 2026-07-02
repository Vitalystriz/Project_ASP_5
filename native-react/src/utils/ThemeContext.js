import React, { createContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { getItem, setItem } from './storage';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const systemColorScheme = useColorScheme();
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme = await getItem('theme');
                if (savedTheme) {
                    setTheme(savedTheme);
                } else {
                    setTheme(systemColorScheme || 'light');
                }
            } catch (e) {
                console.error("Error loading theme", e);
            }
        };
        loadTheme();
    }, [systemColorScheme]);

    const toggleTheme = async () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        await setItem('theme', newTheme);
    };

    const isDark = theme === 'dark';

    return (
        <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
