import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000/api';

export interface ApiError {
  message: string;
  code?: string;
  statusCode: number;
}

async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem('auth_token');
}

async function setToken(token: string): Promise<void> {
  await AsyncStorage.setItem('auth_token', token);
}

async function removeToken(): Promise<void> {
  await AsyncStorage.removeItem('auth_token');
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getToken();
  const url = `${API_URL}${endpoint}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({
      message: 'An error occurred',
      statusCode: response.status,
    }));
    throw error;
  }

  return response.json();
}

export { getToken, setToken, removeToken, API_URL };

