import { fetchApi, setAuthToken, removeAuthToken } from './api';
import type { UserProfile } from '../types';

export interface AuthResponse {
  success: boolean;
  token: string;
  user: UserProfile;
}

export const authService = {
  async login(email: string, password?: string): Promise<AuthResponse> {
    const data = await fetchApi<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password: password || 'password123' })
    });
    if (data.token) {
      setAuthToken(data.token);
    }
    return data;
  },

  async signup(userData: Partial<UserProfile> & { password?: string }): Promise<AuthResponse> {
    const data = await fetchApi<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: userData.name || 'New Student',
        email: userData.email,
        password: userData.password || 'password123',
        college: userData.college,
        currentYear: userData.currentYear,
        targetRole: userData.targetRole
      })
    });
    if (data.token) {
      setAuthToken(data.token);
    }
    return data;
  },

  async me(): Promise<{ success: boolean; user: UserProfile }> {
    return fetchApi<{ success: boolean; user: UserProfile }>('/auth/me');
  },

  logout(): void {
    removeAuthToken();
  }
};
