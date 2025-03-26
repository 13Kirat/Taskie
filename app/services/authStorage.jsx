import AsyncStorage from '@react-native-async-storage/async-storage';

// Token key
const TOKEN_KEY = 'task_manager_auth_token';

// Store authentication token
const storeToken = async (token) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    return true;
  } catch (error) {
    // console.error('Error storing token', error);
    return false;
  }
};

// Get authentication token
const getToken = async () => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    // console.error('Error getting token', error);
    return null;
  }
};

// Remove authentication token
const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
    return true;
  } catch (error) {
    // console.error('Error removing token', error);
    return false;
  }
};

export default {
  storeToken,
  getToken,
  removeToken
};
