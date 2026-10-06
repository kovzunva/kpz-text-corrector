const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface AuthUser {
  readonly id: string;
  readonly email: string;
}

export interface AuthResponse {
  readonly message: string;
  readonly user: AuthUser;
}

export async function loginApi(payload: { email: string; password: string }): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(errorData.message || 'Login failed. Please check your credentials.');
  }

  return (await response.json()) as AuthResponse;
}

export async function registerApi(payload: { email: string; password: string }): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(errorData.message || 'Registration failed. Please try again.');
  }

  return (await response.json()) as AuthResponse;
}
