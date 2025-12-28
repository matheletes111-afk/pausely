import { apiRequest } from './client';
import type { ImpulseType } from '@pausely/shared';

export async function getImpulseTypes(): Promise<ImpulseType[]> {
  return apiRequest<ImpulseType[]>('/impulse-types');
}

export async function getUserImpulseTypes(): Promise<Array<ImpulseType & { isActive: boolean }>> {
  return apiRequest<Array<ImpulseType & { isActive: boolean }>>('/user-impulse-types');
}

