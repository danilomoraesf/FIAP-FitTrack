import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getItem<T>(key: string): Promise<T | null> {
  const jsonValue = await AsyncStorage.getItem(key);
  return jsonValue != null ? (JSON.parse(jsonValue) as T) : null;
}

export async function setItem<T>(key: string, value: T): Promise<void> {
  const jsonValue = JSON.stringify(value);
  await AsyncStorage.setItem(key, jsonValue);
}
