import AsyncStorage from '@react-native-async-storage/async-storage';

//счётчик для достижений

export const getLocalCount = async (key: string): Promise<number> => {
  const val = await AsyncStorage.getItem(key);
  return val ? parseInt(val, 10) : 0;
};

export const saveLocalCount = async (key: string, value: number) => {
  await AsyncStorage.setItem(key, value.toString());
};
