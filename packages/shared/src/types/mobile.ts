import type { ImpulseTypeEnum, UrgeOutcome } from './api';

export interface OnboardingData {
  selectedImpulseTypes: ImpulseTypeEnum[];
  customTimers?: Record<ImpulseTypeEnum, number>;
}

export interface UrgeSessionState {
  sessionId: string | null;
  impulseType: ImpulseTypeEnum | null;
  timerMinutes: number;
  timeRemaining: number;
  isActive: boolean;
  messages: Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
  outcome: UrgeOutcome | null;
}

export interface StreakData {
  current: number;
  longest: number;
  lastSuccessDate: Date | null;
  lastResetDate: Date | null;
}

export interface DashboardStats {
  totalSessions: number;
  successRate: number;
  currentStreak: number;
  longestStreak: number;
  impulseFrequency: Record<ImpulseTypeEnum, number>;
  recentSessions: Array<{
    id: string;
    impulseType: ImpulseTypeEnum;
    outcome: UrgeOutcome;
    startedAt: Date;
  }>;
}

