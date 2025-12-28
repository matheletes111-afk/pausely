import { prisma } from '@pausely/db';
import type { UrgeOutcome } from '@pausely/db';

export interface StreakUpdateResult {
  currentStreak: number;
  longestStreak: number;
  updated: boolean;
}

export async function updateStreak(
  userId: string,
  outcome: UrgeOutcome
): Promise<StreakUpdateResult> {
  const streak = await prisma.streak.findUnique({
    where: { userId },
  });

  if (!streak) {
    // Create new streak
    const newStreak = await prisma.streak.create({
      data: {
        userId,
        currentStreak: outcome === 'SUCCESS' ? 1 : 0,
        longestStreak: outcome === 'SUCCESS' ? 1 : 0,
        lastSuccessDate: outcome === 'SUCCESS' ? new Date() : null,
        lastResetDate: outcome === 'RELAPSE' ? new Date() : null,
      },
    });

    return {
      currentStreak: newStreak.currentStreak,
      longestStreak: newStreak.longestStreak,
      updated: true,
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastSuccessDate = streak.lastSuccessDate
    ? new Date(streak.lastSuccessDate)
    : null;
  if (lastSuccessDate) {
    lastSuccessDate.setHours(0, 0, 0, 0);
  }

  const daysSinceLastSuccess = lastSuccessDate
    ? Math.floor((today.getTime() - lastSuccessDate.getTime()) / (1000 * 60 * 60 * 24))
    : Infinity;

  let newCurrentStreak = streak.currentStreak;
  let newLongestStreak = streak.longestStreak;
  let newLastSuccessDate = streak.lastSuccessDate;
  let newLastResetDate = streak.lastResetDate;

  if (outcome === 'SUCCESS') {
    if (daysSinceLastSuccess === 0) {
      // Already succeeded today, don't increment
      return {
        currentStreak: streak.currentStreak,
        longestStreak: streak.longestStreak,
        updated: false,
      };
    } else if (daysSinceLastSuccess === 1) {
      // Consecutive day - increment streak
      newCurrentStreak = streak.currentStreak + 1;
    } else if (daysSinceLastSuccess > 1 && daysSinceLastSuccess <= 3) {
      // Gentle recovery: if missed 1-3 days, continue from previous streak
      // This is a "gentle" approach - we don't harshly reset
      newCurrentStreak = streak.currentStreak + 1;
    } else {
      // More than 3 days missed - start fresh but acknowledge previous success
      newCurrentStreak = 1;
    }

    newLastSuccessDate = today;
    newLongestStreak = Math.max(newLongestStreak, newCurrentStreak);
  } else if (outcome === 'RELAPSE') {
    // Don't harshly reset - just note the reset date
    // The streak continues but we track the relapse
    newLastResetDate = today;
    // Keep current streak but mark the reset
    // This is gentler than resetting to 0
  }

  const updated = await prisma.streak.update({
    where: { userId },
    data: {
      currentStreak: newCurrentStreak,
      longestStreak: newLongestStreak,
      lastSuccessDate: newLastSuccessDate,
      lastResetDate: newLastResetDate,
    },
  });

  return {
    currentStreak: updated.currentStreak,
    longestStreak: updated.longestStreak,
    updated: true,
  };
}

