import type { HabitCategory, HabitStatus } from "@/lib/constants/habits";
import { HABIT_STATUS_WEIGHTS } from "@/lib/constants/habits";
import type { DayType } from "@/lib/constants/day-types";
import type { WarningLevel } from "@/lib/constants/warnings";
import type { DailyBalanceResult } from "@/lib/scoring/types";

export type MonthlyDayReview = {
  date: string;
  dayOfMonth: string;
  weekdayLabel: string;
  weekKey: string;
  dayType: DayType;
  hasData: boolean;
  isFuture: boolean;
  score: DailyBalanceResult;
  mood: number | null;
  motivation: number | null;
  stress: number | null;
};

export type MonthlyHabitDayStatus = HabitStatus | null;

export type MonthlyHabitReview = {
  id: string;
  name: string;
  category: HabitCategory;
  weight: number;
  targetPerWeek: number;
  isActive: boolean;
  statuses: Record<string, MonthlyHabitDayStatus>;
  doneCount: number;
  partialCount: number;
  skippedCount: number;
  missedCount: number;
  emptyCount: number;
  completionPercent: number;
  bestStreak: number;
};

export type MonthlyChartPoint = {
  date: string;
  label: string;
  completion: number | null;
  score: number | null;
  focusHours: number | null;
  restHours: number | null;
  sleepHours: number | null;
  mood: number | null;
  motivation: number | null;
  stress: number | null;
};

export type MonthlyWeeklyProgressPoint = {
  weekKey: string;
  label: string;
  completion: number;
  score: number;
  focusHours: number;
  restHours: number;
  sleepHours: number;
};

export type MonthlyStats = {
  completionPercent: number;
  trackedDayCount: number;
  elapsedDayCount: number;
  totalDayCount: number;
  averageSleepMinutes: number;
  sleepDayCount: number;
  averageMood: number | null;
  averageMotivation: number | null;
  averageStress: number | null;
  bestDay: {
    date: string;
    label: string;
    completionPercent: number;
  } | null;
  weakDayCount: number;
  bestStreak: number;
  weakHabitCount: number;
  skippedOrMissedCount: number;
  trendDirection: "improving" | "stable" | "declining";
};

export type MonthlyReviewInput = {
  month: string;
  days: MonthlyDayReview[];
  habits: MonthlyHabitReview[];
};

export type MonthlyReviewResult = MonthlyReviewInput & {
  stats: MonthlyStats;
  dailyProgress: MonthlyChartPoint[];
  weeklyProgress: MonthlyWeeklyProgressPoint[];
  topHabits: MonthlyHabitReview[];
  weakHabits: MonthlyHabitReview[];
  warningLevel: WarningLevel;
};

function round(value: number) {
  return Math.round(value);
}

function average(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function nullableAverage(values: Array<number | null | undefined>) {
  const numericValues = values.filter(
    (value): value is number => typeof value === "number"
  );

  if (numericValues.length === 0) {
    return null;
  }

  return Math.round(average(numericValues) * 10) / 10;
}

function minutesToChartHours(minutes: number) {
  return Math.round((minutes / 60) * 10) / 10;
}

export function calculateHabitCompletionPercent(
  statuses: MonthlyHabitDayStatus[],
  denominator: number
) {
  const skippedCount = statuses.filter((status) => status === "skipped").length;
  const adjustedDenominator = Math.max(denominator - skippedCount, 0);

  if (adjustedDenominator <= 0) {
    return 0;
  }

  const weightedCompletion = statuses.reduce((sum, status) => {
    if (!status || status === "skipped") {
      return sum;
    }

    return sum + HABIT_STATUS_WEIGHTS[status];
  }, 0);

  return Math.min(round((weightedCompletion / adjustedDenominator) * 100), 100);
}

function getLongestCompletionStreak(days: MonthlyDayReview[]) {
  let currentStreak = 0;
  let bestStreak = 0;

  for (const day of days) {
    if (
      !day.isFuture &&
      day.score.dataStatus.isComplete &&
      day.score.metrics.habitCompletionPercent >= 60
    ) {
      currentStreak += 1;
      bestStreak = Math.max(bestStreak, currentStreak);
    } else if (!day.isFuture) {
      currentStreak = 0;
    }
  }

  return bestStreak;
}

function getTrendDirection(days: MonthlyDayReview[]) {
  const elapsedDays = days.filter(
    (day) => !day.isFuture && day.score.dataStatus.isComplete
  );
  const recentDays = elapsedDays.slice(-7);
  const previousDays = elapsedDays.slice(-14, -7);
  const recentAverage = average(
    recentDays.map((day) => day.score.metrics.habitCompletionPercent)
  );
  const previousAverage = average(
    previousDays.map((day) => day.score.metrics.habitCompletionPercent)
  );

  if (recentDays.length < 3 || previousDays.length < 3) {
    return "stable";
  }

  if (recentAverage >= previousAverage + 10) {
    return "improving";
  }

  if (recentAverage <= previousAverage - 10) {
    return "declining";
  }

  return "stable";
}

function getBestDay(days: MonthlyDayReview[]) {
  const elapsedDays = days.filter(
    (day) => !day.isFuture && day.score.dataStatus.isComplete
  );

  if (elapsedDays.length === 0) {
    return null;
  }

  const bestDay = [...elapsedDays].sort(
    (first, second) =>
      second.score.metrics.habitCompletionPercent -
      first.score.metrics.habitCompletionPercent
  )[0];

  return {
    date: bestDay.date,
    label: `${bestDay.weekdayLabel}, ${bestDay.dayOfMonth}`,
    completionPercent: bestDay.score.metrics.habitCompletionPercent,
  };
}

function getWeeklyProgress(days: MonthlyDayReview[]) {
  const groups = new Map<string, MonthlyDayReview[]>();

  for (const day of days.filter(
    (item) => !item.isFuture && item.score.dataStatus.isComplete
  )) {
    groups.set(day.weekKey, [...(groups.get(day.weekKey) ?? []), day]);
  }

  return Array.from(groups.entries()).map(([weekKey, weekDays], index) => ({
    weekKey,
    label: `W${index + 1}`,
    completion: round(
      average(weekDays.map((day) => day.score.metrics.habitCompletionPercent))
    ),
    score: round(average(weekDays.map((day) => day.score.totalScore))),
    focusHours: minutesToChartHours(
      weekDays.reduce((sum, day) => sum + day.score.metrics.focusMinutes, 0)
    ),
    restHours: minutesToChartHours(
      weekDays.reduce((sum, day) => sum + day.score.metrics.restMinutes, 0)
    ),
    sleepHours: minutesToChartHours(
      average(
        weekDays
          .map((day) => day.score.metrics.sleepMinutes)
          .filter((minutes) => minutes > 0)
      )
    ),
  }));
}

export function calculateMonthlyReview(
  input: MonthlyReviewInput
): MonthlyReviewResult {
  const elapsedDays = input.days.filter((day) => !day.isFuture);
  const completeDays = elapsedDays.filter((day) => day.score.dataStatus.isComplete);
  const habitCompletions = completeDays.map(
    (day) => day.score.metrics.habitCompletionPercent
  );
  const sleepMinutes = completeDays
    .map((day) => day.score.metrics.sleepMinutes)
    .filter((minutes) => minutes > 0);
  const weakHabits = [...input.habits]
    .filter((habit) => habit.completionPercent < 50)
    .sort((first, second) => first.completionPercent - second.completionPercent);
  const topHabits = [...input.habits]
    .filter((habit) => habit.completionPercent > 0)
    .sort((first, second) => second.completionPercent - first.completionPercent)
    .slice(0, 5);
  const weakDayCount = completeDays.filter(
    (day) => day.score.metrics.habitCompletionPercent < 50
  ).length;

  return {
    ...input,
    stats: {
      completionPercent: round(average(habitCompletions)),
      trackedDayCount: completeDays.length,
      elapsedDayCount: elapsedDays.length,
      totalDayCount: input.days.length,
      averageSleepMinutes: round(average(sleepMinutes)),
      sleepDayCount: sleepMinutes.length,
      averageMood: nullableAverage(completeDays.map((day) => day.mood)),
      averageMotivation: nullableAverage(completeDays.map((day) => day.motivation)),
      averageStress: nullableAverage(completeDays.map((day) => day.stress)),
      bestDay: getBestDay(input.days),
      weakDayCount,
      bestStreak: getLongestCompletionStreak(input.days),
      weakHabitCount: weakHabits.length,
      skippedOrMissedCount: input.habits.reduce(
        (sum, habit) => sum + habit.skippedCount + habit.missedCount,
        0
      ),
      trendDirection: getTrendDirection(input.days),
    },
    dailyProgress: input.days.map((day) => ({
      date: day.date,
      label: day.dayOfMonth,
      completion: day.isFuture || !day.score.dataStatus.isComplete
        ? null
        : day.score.metrics.habitCompletionPercent,
      score: day.isFuture || !day.score.dataStatus.isComplete ? null : day.score.totalScore,
      focusHours: day.isFuture || !day.score.dataStatus.isComplete
        ? null
        : minutesToChartHours(day.score.metrics.focusMinutes),
      restHours: day.isFuture || !day.score.dataStatus.isComplete
        ? null
        : minutesToChartHours(day.score.metrics.restMinutes),
      sleepHours:
        day.isFuture ||
        !day.score.dataStatus.isComplete ||
        day.score.metrics.sleepMinutes <= 0
          ? null
          : minutesToChartHours(day.score.metrics.sleepMinutes),
      mood: day.isFuture || !day.score.dataStatus.isComplete ? null : day.mood,
      motivation:
        day.isFuture || !day.score.dataStatus.isComplete ? null : day.motivation,
      stress: day.isFuture || !day.score.dataStatus.isComplete ? null : day.stress,
    })),
    weeklyProgress: getWeeklyProgress(input.days),
    topHabits,
    weakHabits: weakHabits.slice(0, 5),
    warningLevel: "good",
  };
}
