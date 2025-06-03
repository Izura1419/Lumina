import AsyncStorage from '@react-native-async-storage/async-storage';
import { unlockAward } from './awardService';

const STREAK_KEY = 'user_streak';
const LAST_OPEN_KEY = 'last_open_date';

const getToday = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()); // обрезаем время
};

export const updateStreak = async () => {
  const today = getToday();
  const lastOpenStr = await AsyncStorage.getItem(LAST_OPEN_KEY);
  let streak = 1;

  if (lastOpenStr) {
    const lastOpen = new Date(lastOpenStr);
    const diff = (today.getTime() - lastOpen.getTime()) / (1000 * 60 * 60 * 24);

    if (diff === 1) {
      const storedStreak = await AsyncStorage.getItem(STREAK_KEY);
      streak = storedStreak ? parseInt(storedStreak, 10) + 1 : 2;
    } else if (diff === 0) {
      return; // уже открывали сегодня
    } else {
      streak = 1; // streak сброшен
    }
  }

  await AsyncStorage.setItem(STREAK_KEY, streak.toString());
  await AsyncStorage.setItem(LAST_OPEN_KEY, today.toISOString());

  // выдача наград
  if (streak === 3) await unlockAward("focused_3_days");
  if (streak === 7) await unlockAward("focused_7_days");
  if (streak === 30) await unlockAward("karate");
};
