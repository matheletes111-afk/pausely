import { apiRequest } from './client';
import type { StreakResponse } from '@pausely/shared';

export async function getCurrentStreak(): Promise<StreakResponse> {
  return apiRequest<StreakResponse>('/streaks/current');
}

export async function getStreakHistory(): Promise<StreakResponse[]> {
  return apiRequest<StreakResponse[]>('/streaks/history');
}

