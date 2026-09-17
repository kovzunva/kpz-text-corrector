import { CheckTextResponse } from '../types/domain';

export interface CheckTextPayload {
  readonly text: string;
  readonly language?: string;
  readonly pageIndex?: number;
  readonly pageSize?: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function checkGuestText(payload: CheckTextPayload): Promise<CheckTextResponse> {
  const response = await fetch(`${API_BASE_URL}/v1/text/check-guest`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(errorData.message || 'Failed to check text');
  }

  return (await response.json()) as CheckTextResponse;
}

export async function checkUserText(payload: CheckTextPayload): Promise<CheckTextResponse> {
  const response = await fetch(`${API_BASE_URL}/v1/text/check`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(errorData.message || 'Failed to check text');
  }

  return (await response.json()) as CheckTextResponse;
}
