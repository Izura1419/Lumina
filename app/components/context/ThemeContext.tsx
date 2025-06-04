import React, { createContext, useState, useContext, useEffect } from 'react';
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { useColorScheme } from 'react-native';

import AsyncStorage from "@react-native-async-storage/async-storage";

import { Colors } from '../constants/Colors';
import { unlockAward } from '../data/awardService';

const lightTheme = { ...MD3LightTheme, colors: Colors.light };
const darkTheme = { ...MD3DarkTheme, colors: Colors.dark }

type ThemeType = typeof lightTheme;

interface ThemeContextType {
    theme: ThemeType;
    toggleTheme: () => void;
    isDarkTheme: boolean;
  }
  
  const ThemeContext = createContext<ThemeContextType>({
    theme: lightTheme,
    toggleTheme: () => {},
    isDarkTheme: false,
  });
  
  const THEME_KEY = "APP_THEME";
  
  export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const colorScheme = useColorScheme();
    const [isDarkTheme, setIsDarkTheme] = useState(colorScheme === "dark");
  
    useEffect(() => {
      const loadTheme = async () => {
        try {
          const storedTheme = await AsyncStorage.getItem(THEME_KEY);
          if (storedTheme !== null) {
            setIsDarkTheme(storedTheme === "dark");
          } else {
            setIsDarkTheme(colorScheme === "dark");
          }
        } catch (error) {
          console.error("Ошибка загрузки темы", error);
        }
      };
  
      loadTheme();
    }, []);
  
    const toggleTheme = async () => {
      try {
        const newTheme = !isDarkTheme ? "dark" : "light";

        if(newTheme === 'dark'){
          await unlockAward("night_mode");
        }

        setIsDarkTheme(!isDarkTheme);
        await AsyncStorage.setItem(THEME_KEY, newTheme);
      } catch (error) {
        console.error("Ошибка сохранения темы", error);
      }
    };
  
    const theme = isDarkTheme ? darkTheme : lightTheme;
  
    return (
      <ThemeContext.Provider value={{ theme, toggleTheme, isDarkTheme }}>
        {children}
      </ThemeContext.Provider>
    );
  };
  
  export const useThemeContext = () => useContext(ThemeContext);