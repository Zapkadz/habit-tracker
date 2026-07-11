import { HABIT_STATUS_WEIGHTS, type HabitStatus } from "@/lib/constants/habits";

export function getExpectedHabitOccurrences(
  eligibleDayCount: number,
  targetPerWeek: number
) {
  if (eligibleDayCount <= 0 || targetPerWeek <= 0) {
    return 0;
  }

  return Math.min(
    eligibleDayCount,
    Math.ceil((eligibleDayCount / 7) * targetPerWeek)
  );
}

export function calculateTargetHabitCompletionPercent(
  statuses: Array<HabitStatus | null>,
  targetPerWeek: number,
  eligibleDayCount: number
) {
  const expectedOccurrences = getExpectedHabitOccurrences(
    eligibleDayCount,
    targetPerWeek
  );

  if (expectedOccurrences <= 0) {
    return 0;
  }

  const skippedCount = statuses.filter((status) => status === "skipped").length;
  const denominator = Math.max(expectedOccurrences - skippedCount, 0);

  if (denominator <= 0) {
    return 100;
  }

  const weightedCompletion = statuses.reduce((sum, status) => {
    if (!status || status === "skipped") {
      return sum;
    }

    return sum + HABIT_STATUS_WEIGHTS[status];
  }, 0);

  return Math.min(Math.round((weightedCompletion / denominator) * 100), 100);
}
