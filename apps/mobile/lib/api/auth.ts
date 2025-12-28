import { apiRequest, setToken, removeToken } from './client';
import type { RegisterRequest, LoginRequest, AuthResponse } from '@pausely/shared';

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  await setToken(response.token);
  return response;
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  await setToken(response.token);
  return response;
}

export async function logout(): Promise<void> {
  await apiRequest('/auth/logout', {
    method: 'POST',
  });
  await removeToken();
}

