const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const getAuthToken = (): string | null => {
  return localStorage.getItem('skillpath_jwt_token');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('skillpath_jwt_token', token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('skillpath_jwt_token');
};

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>)
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'API Request Failed');
  }

  return data;
}
