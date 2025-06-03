import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type TimerSettingsContextType = {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  setFocusDuration: (value: number) => void;
  setShortBreakDuration: (value: number) => void;
  setLongBreakDuration: (value: number) => void;
};

const TimerSettingsContext = createContext<TimerSettingsContextType | undefined>(undefined);

export const TimerSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [focusDuration, setFocusDurationState] = useState<number>(25);
  const [shortBreakDuration, setShortBreakDurationState] = useState<number>(5);
  const [longBreakDuration, setLongBreakDurationState] = useState<number>(15);

  const STORAGE_FOCUS_KEY = 'FOCUS_DURATION';
  const STORAGE_SHORT_BREAK_KEY = 'SHORT_BREAK_DURATION';
  const STORAGE_LONG_BREAK_KEY = 'LONG_BREAK_DURATION';

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedFocus = await AsyncStorage.getItem(STORAGE_FOCUS_KEY);
        const savedShortBreak = await AsyncStorage.getItem(STORAGE_SHORT_BREAK_KEY);
        const savedLongBreak = await AsyncStorage.getItem(STORAGE_LONG_BREAK_KEY);
        if (savedFocus !== null && savedShortBreak !== null && savedLongBreak !== null) {
          setFocusDurationState(Number(savedFocus));
          setShortBreakDurationState(Number(savedShortBreak));
          setLongBreakDurationState(Number(savedLongBreak));
        }
      } catch (e) {
        console.warn('Ошибка при загрузке таймера из AsyncStorage', e);
      }
    };

    loadSettings();
  }, []);

  const setFocusDuration = async (value: number) => {
    try {
      await AsyncStorage.setItem(STORAGE_FOCUS_KEY, value.toString());
      setFocusDurationState(value);
    } catch (e) {
      console.warn('Ошибка при сохранении таймера в AsyncStorage', e);
    }
  };

  const setShortBreakDuration = async (value: number) => {
    try {
      await AsyncStorage.setItem(STORAGE_SHORT_BREAK_KEY, value.toString());
      setShortBreakDurationState(value);
    } catch (e) {
      console.warn('Ошибка при сохранении таймера в AsyncStorage', e);
    }
  };

  const setLongBreakDuration = async (value: number) => {
    try {
      await AsyncStorage.setItem(STORAGE_LONG_BREAK_KEY, value.toString());
      setLongBreakDurationState(value);
    } catch (e) {
      console.warn('Ошибка при сохранении таймера в AsyncStorage', e);
    }
  };

  return (
    <TimerSettingsContext.Provider value={{ 
      focusDuration, setFocusDuration, 
      shortBreakDuration, setShortBreakDuration,
      longBreakDuration, setLongBreakDuration
    }}>
      {children}
    </TimerSettingsContext.Provider>
  );
};

export const useTimerSettings = () => {
  const context = useContext(TimerSettingsContext);
  if (!context) {
    throw new Error('useTimerSettings must be used within a TimerSettingsProvider');
  }
  return context;
};
