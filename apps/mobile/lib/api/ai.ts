import { apiRequest } from './client';
import type { AIMessageRequest, AIMessageResponse } from '@pausely/shared';

export async function sendAIMessage(data: AIMessageRequest): Promise<AIMessageResponse> {
  return apiRequest<AIMessageResponse>(`/urge-sessions/${data.sessionId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ content: data.content }),
  });
}

