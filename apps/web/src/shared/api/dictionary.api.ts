import { UserDictionaryRule } from '../types/domain';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function fetchDictionaryRules(): Promise<readonly UserDictionaryRule[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/dictionary`);
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
  const response = await fetch(`${API_BASE_URL}/v1/dictionary`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ wordPattern, ruleId }),
  });

  if (!response.ok) {
    throw new Error('Failed to create dictionary rule');
  }

  return (await response.json()) as UserDictionaryRule;
}

export async function deleteDictionaryRule(id: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/v1/dictionary/${id}`, {
    method: 'DELETE',
  });

  return response.ok;
}
