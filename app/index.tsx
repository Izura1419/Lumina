import React, {useEffect} from "react";

import { StatusBar } from "react-native";
import { PaperProvider } from "react-native-paper";

import { useThemeContext, ThemeProvider } from '../components/context/ThemeContext';
import DrawerNavigator from "./DrawerNavigator";
import { TimerSettingsProvider } from "../components/context/TimerSettingsContext";

import { updateStreak } from "../components/data/streakService";

import 'react-native-get-random-values';


function MainApp() {
  const { theme, isDarkTheme } = useThemeContext();

  //обновления череды захода в приложение
  useEffect(() => {
    updateStreak();
  }, []);

  return (
    <PaperProvider theme={theme}>
        <StatusBar
          animated={true}
          barStyle={isDarkTheme ? "light-content" : "dark-content"}
          backgroundColor={theme.colors.background}
        />
        <DrawerNavigator/>
    </PaperProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <TimerSettingsProvider>
        <MainApp />
      </TimerSettingsProvider>
    </ThemeProvider>
  );
}