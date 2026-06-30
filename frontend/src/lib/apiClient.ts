import { RegisterData, LoginData } from './types';

const BASE_URL = 'http://localhost:8080/api';

export const apiClient = {
  async register(data: RegisterData) {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Registration failed');
    return res.json();
  },
  async login(data: LoginData) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
  }
};
