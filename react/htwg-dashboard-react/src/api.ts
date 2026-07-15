import type { Meal, User } from './types';

const API_URL = import.meta.env.VITE_API_URL ?? '/api';

interface TokenResponse {
  token: string;
}

interface UserResponse {
  user: User;
}

interface ErrorResponse {
  error?: string;
}

const requestJson = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_URL}${path}`, options);
  const body = (await response.json().catch(() => ({}))) as T & ErrorResponse;

  if (!response.ok) {
    throw new Error(body.error ?? `Anfrage fehlgeschlagen (${response.status}).`);
  }

  return body;
};

export const loginRequest = (username: string, password: string) =>
  requestJson<TokenResponse>('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

export const registerRequest = (username: string, email: string, password: string) =>
  requestJson<TokenResponse>('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });

export const getCurrentUser = (token: string) =>
  requestJson<UserResponse>('/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getMeals = (signal?: AbortSignal) =>
  requestJson<Meal[]>('/meals', { signal });
