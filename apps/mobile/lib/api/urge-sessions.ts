import { apiRequest } from './client';
import type { CreateUrgeSessionRequest, UrgeSessionResponse } from '@pausely/shared';

export async function createUrgeSession(
  data: CreateUrgeSessionRequest
): Promise<UrgeSessionResponse> {
  return apiRequest<UrgeSessionResponse>('/urge-sessions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getUrgeSessions(): Promise<UrgeSessionResponse[]> {
  return apiRequest<UrgeSessionResponse[]>('/urge-sessions');
}

export async function getUrgeSession(id: string): Promise<UrgeSessionResponse> {
  return apiRequest<UrgeSessionResponse>(`/urge-sessions/${id}`);
}

export async function completeUrgeSession(
  id: string,
  outcome: 'SUCCESS' | 'RELAPSE' | 'ABANDONED'
): Promise<UrgeSessionResponse> {
  return apiRequest<UrgeSessionResponse>(`/urge-sessions/${id}/complete`, {
    method: 'POST',
    body: JSON.stringify({ outcome }),
  });
}

