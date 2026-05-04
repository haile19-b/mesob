import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// We'll use your local backend URL for development.
// Since you're using Expo, you can use your machine's local IP or localhost.
// Wait, for Android emulator it's 10.0.2.2, for iOS it's localhost.
// We'll define a constant for it. Replace with your actual backend IP if testing on a physical device.
const API_URL = 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error fetching token from SecureStore', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
