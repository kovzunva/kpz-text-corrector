import { UserDictionaryRule } from '../types/domain';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export function getStoredUserId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('textguard_user_session');
    if (!raw) return null;
    const user = JSON.parse(raw) as { id?: string };
    return user.id || null;
  } catch {
    return null;
  }
}

export async function fetchDictionaryRules(): Promise<readonly UserDictionaryRule[]> {
  const userId = getStoredUserId();
  if (!userId) return [];

  try {
    const response = await fetch(`${API_BASE_URL}/v1/dictionary`, {
      headers: {
        'x-user-id': userId,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch dictionary rules');
    }
    return (await response.json()) as UserDictionaryRule[];
  } catch {
    return [];
  }
}

export async function createDictionaryRule(
  wordPattern?: string,
  ruleId?: string,
): Promise<UserDictionaryRule> {
  const userId = getStoredUserId();
  if (!userId) {
    throw new Error('Sign in required to create persistent dictionary rules');
  }

  const response = await fetch(`${API_BASE_URL}/v1/dictionary`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': userId,
    },
    body: JSON.stringify({ wordPattern, ruleId }),
  });

  if (!response.ok) {
    throw new Error('Failed to create dictionary rule');
  }

  return (await response.json()) as UserDictionaryRule;
}

export async function deleteDictionaryRule(id: string): Promise<boolean> {
  const userId = getStoredUserId();
  if (!userId) return false;

  const response = await fetch(`${API_BASE_URL}/v1/dictionary/${id}`, {
    method: 'DELETE',
    headers: {
      'x-user-id': userId,
    },
  });

  return response.ok;
}
