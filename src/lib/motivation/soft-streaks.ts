import type { AnalyticsDayPoint } from "@/lib/analytics/trends";

export type SoftStreakResult = {
  goodDays: number;
  trackedDays: number;
  totalDays: number;
  currentStreak: number;
  bestStreak: number;
  consistencyPercent: number;
  message: string;
};

function isGoodDay(day: AnalyticsDayPoint) {
  return day.hasData && day.score.metrics.habitCompletionPercent >= 60;
}

export function calculateSoftStreak(days: AnalyticsDayPoint[]): SoftStreakResult {
  let currentRun = 0;
  let bestStreak = 0;

  for (const day of days) {
    if (isGoodDay(day)) {
      currentRun += 1;
      bestStreak = Math.max(bestStreak, currentRun);
    } else if (day.hasData) {
      currentRun = 0;
    }
  }

  const goodDays = days.filter(isGoodDay).length;
  const trackedDays = days.filter((day) => day.hasData).length;
  const consistencyPercent =
    days.length > 0 ? Math.round((goodDays / days.length) * 100) : 0;
  const currentStreak = days.reduceRight((streak, day) => {
    if (streak === -1) {
      return -1;
    }

    if (!day.hasData) {
      return streak;
    }

    return isGoodDay(day) ? streak + 1 : -1;
  }, 0);
  const safeCurrentStreak = Math.max(currentStreak, 0);

  return {
    goodDays,
    trackedDays,
    totalDays: days.length,
    currentStreak: safeCurrentStreak,
    bestStreak,
    consistencyPercent,
    message:
      trackedDays === 0
        ? "No streak yet. Log one honest day and the system can start helping."
        : `${goodDays}/${days.length} days were steady. This is a soft streak, not a punishment system.`,
  };
}
