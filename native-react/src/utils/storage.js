import { Platform } from 'react-native';

const hasLocalStorage = typeof window !== 'undefined' && window.localStorage;
const memoryStore = {};

export const getItem = async (key) => {
  if (hasLocalStorage) {
    return window.localStorage.getItem(key);
  }
  
  try {
    // Dynamic import to prevent crash if not installed
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    return await AsyncStorage.getItem(key);
  } catch (e) {
    return memoryStore[key] || null;
  }
};

export const setItem = async (key, value) => {
  if (hasLocalStorage) {
    window.localStorage.setItem(key, value);
    return;
  }
  
  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    memoryStore[key] = value;
  }
};

export const removeItem = async (key) => {
  if (hasLocalStorage) {
    window.localStorage.removeItem(key);
    return;
  }
  
  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    await AsyncStorage.removeItem(key);
  } catch (e) {
    delete memoryStore[key];
  }
};
