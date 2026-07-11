import type { DayType } from "@/lib/constants/day-types";
import type { TimeBlockCategory } from "@/lib/constants/planner";
import { TIME_BLOCK_CATEGORY_LABELS } from "@/lib/constants/planner";
import type { WarningLevel } from "@/lib/constants/warnings";
import type { DailyBalanceResult } from "@/lib/scoring/types";

export type TrendDirection = "up" | "down" | "flat";

export type AnalyticsDayPoint = {
  date: string;
  label: string;
  dayType: DayType;
  hasData: boolean;
  score: DailyBalanceResult;
  mood: number | null;
  motivation: number | null;
  stress: number | null;
  plannedMinutes: number;
  actualMinutes: number | null;
  actualCoverageMinutes: number;
  planAccuracyPercent: number | null;
  skippedBlockCount: number;
};

export type AnalyticsTrendPoint = {
  date: string;
  label: string;
  score: number | null;
  habitCompletion: number | null;
  sleepHours: number | null;
  focusHours: number | null;
  restHours: number | null;
  mood: number | null;
  motivation: number | null;
  stress: number | null;
  plannedHours: number;
  actualHours: number | null;
  planAccuracy: number | null;
  risk: number | null;
};

export type AnalyticsCategoryBreakdown = {
  category: TimeBlockCategory;
  label: string;
  plannedMinutes: number;
  actualMinutes: number;
  actualCoverageMinutes: number;
  blockCount: number;
  skippedCount: number;
  actualVsPlannedPercent: number | null;
};

export type AnalyticsSummary = {
  averageScore: number;
  trackedDayCount: number;
  totalDayCount: number;
  averageSleepMinutes: number;
  sleepDayCount: number;
  totalFocusMinutes: number;
  totalRestMinutes: number;
  averageHabitCompletion: number;
  plannedMinutes: number;
  actualMinutes: number;
  actualCoverageMinutes: number;
  planAccuracyPercent: number | null;
  overplannedDayCount: number;
  skippedBlockCount: number;
  riskDayCount: number;
  warningDayCount: number;
  lowSleepStreak: number;
  highStressStreak: number;
  lowRestHeavyFocusDayCount: number;
  habitTrendDirection: TrendDirection;
  scoreTrendDirection: TrendDirection;
};

export type AnalyticsReviewInput = {
  startDate: string;
  endDate: string;
  presetDays: number | null;
  label: string;
  days: AnalyticsDayPoint[];
  categoryBreakdown: AnalyticsCategoryBreakdown[];
};

export type AnalyticsReviewResult = AnalyticsReviewInput & {
  summary: AnalyticsSummary;
  trends: AnalyticsTrendPoint[];
  topCategories: AnalyticsCategoryBreakdown[];
  warningLevel: WarningLevel;
};

function round(value: number) {
  return Math.round(value);
}

function roundOne(value: number) {
  return Math.round(value * 10) / 10;
}

function average(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function minutesToHours(totalMinutes: number) {
  return roundOne(totalMinutes / 60);
}

export function calculatePlanAccuracyPercent(
  plannedMinutes: number,
  actualMinutes: number | null
) {
  if (plannedMinutes <= 0 || actualMinutes === null) {
    return null;
  }

  const errorRatio = Math.abs(plannedMinutes - actualMinutes) / plannedMinutes;

  return Math.max(0, round(100 - errorRatio * 100));
}

function getTrendDirection(values: Array<number | null>) {
  const numericValues = values.filter(
    (value): value is number => typeof value === "number"
  );

  if (numericValues.length < 6) {
    return "flat";
  }

  const midpoint = Math.floor(numericValues.length / 2);
  const earlier = numericValues.slice(0, midpoint);
  const recent = numericValues.slice(midpoint);
  const difference = average(recent) - average(earlier);

  if (difference >= 8) {
    return "up";
  }

  if (difference <= -8) {
    return "down";
  }

  return "flat";
}

function getLongestStreak(days: AnalyticsDayPoint[], predicate: (day: AnalyticsDayPoint) => boolean) {
  let currentStreak = 0;
  let bestStreak = 0;

  for (const day of days) {
    if (predicate(day)) {
      currentStreak += 1;
      bestStreak = Math.max(bestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  return bestStreak;
}

function toTrendPoint(day: AnalyticsDayPoint): AnalyticsTrendPoint {
  const { metrics } = day.score;
  const isComplete = day.score.dataStatus.isComplete;
  const score = isComplete ? day.score.totalScore : null;

  return {
    date: day.date,
    label: day.label,
    score,
    habitCompletion: isComplete ? metrics.habitCompletionPercent : null,
    sleepHours:
      isComplete && metrics.sleepMinutes > 0
        ? minutesToHours(metrics.sleepMinutes)
        : null,
    focusHours: isComplete ? minutesToHours(metrics.focusMinutes) : null,
    restHours: isComplete ? minutesToHours(metrics.restMinutes) : null,
    mood: isComplete ? day.mood : null,
    motivation: isComplete ? day.motivation : null,
    stress: isComplete ? day.stress : null,
    plannedHours: minutesToHours(day.plannedMinutes),
    actualHours:
      day.actualMinutes === null ? null : minutesToHours(day.actualMinutes),
    planAccuracy: day.planAccuracyPercent,
    risk: isComplete && day.score.warningLevel === "risk" ? 1 : 0,
  };
}

function getSummary(days: AnalyticsDayPoint[]): AnalyticsSummary {
  const completeDays = days.filter((day) => day.score.dataStatus.isComplete);
  const sleepMinutes = completeDays
    .map((day) => day.score.metrics.sleepMinutes)
    .filter((minutes) => minutes > 0);
  const plannedMinutes = days.reduce((sum, day) => sum + day.plannedMinutes, 0);
  const actualMinutes = days.reduce(
    (sum, day) => sum + (day.actualMinutes ?? 0),
    0
  );
  const actualCoverageMinutes = days.reduce(
    (sum, day) => sum + day.actualCoverageMinutes,
    0
  );
  const planAccuracyValues = days
    .map((day) => day.planAccuracyPercent)
    .filter((value): value is number => typeof value === "number");
  const trendPoints = days.map(toTrendPoint);

  return {
    averageScore: round(average(completeDays.map((day) => day.score.totalScore))),
    trackedDayCount: completeDays.length,
    totalDayCount: days.length,
    averageSleepMinutes: round(average(sleepMinutes)),
    sleepDayCount: sleepMinutes.length,
    totalFocusMinutes: completeDays.reduce(
      (sum, day) => sum + day.score.metrics.focusMinutes,
      0
    ),
    totalRestMinutes: completeDays.reduce(
      (sum, day) => sum + day.score.metrics.restMinutes,
      0
    ),
    averageHabitCompletion: round(
      average(completeDays.map((day) => day.score.metrics.habitCompletionPercent))
    ),
    plannedMinutes,
    actualMinutes,
    actualCoverageMinutes,
    planAccuracyPercent:
      planAccuracyValues.length > 0 ? round(average(planAccuracyValues)) : null,
    overplannedDayCount: days.filter(
      (day) =>
        day.plannedMinutes >= 15 * 60 ||
        (typeof day.planAccuracyPercent === "number" &&
          day.planAccuracyPercent < 70)
    ).length,
    skippedBlockCount: days.reduce((sum, day) => sum + day.skippedBlockCount, 0),
    riskDayCount: completeDays.filter((day) => day.score.warningLevel === "risk")
      .length,
    warningDayCount: completeDays.filter(
      (day) => day.score.warningLevel === "warning"
    ).length,
    lowSleepStreak: getLongestStreak(
      days,
      (day) =>
        day.score.dataStatus.isComplete &&
        day.score.metrics.sleepMinutes > 0 &&
        day.score.metrics.sleepMinutes < 6 * 60
    ),
    highStressStreak: getLongestStreak(
      days,
      (day) =>
        day.score.dataStatus.isComplete &&
        typeof day.stress === "number" &&
        day.stress >= 8
    ),
    lowRestHeavyFocusDayCount: completeDays.filter(
      (day) =>
        day.score.metrics.focusMinutes >= 6 * 60 &&
        day.score.metrics.restMinutes < 45
    ).length,
    habitTrendDirection: getTrendDirection(
      trendPoints.map((point) => point.habitCompletion)
    ),
    scoreTrendDirection: getTrendDirection(trendPoints.map((point) => point.score)),
  };
}

export function buildCategoryBreakdown(
  categories: Map<
    TimeBlockCategory,
    {
      plannedMinutes: number;
      actualMinutes: number;
      actualCoverageMinutes: number;
      blockCount: number;
      skippedCount: number;
    }
  >
): AnalyticsCategoryBreakdown[] {
  return Array.from(categories.entries())
    .map(([category, value]) => ({
      category,
      label: TIME_BLOCK_CATEGORY_LABELS[category],
      ...value,
      actualVsPlannedPercent:
        value.actualCoverageMinutes > 0
          ? round((value.actualMinutes / value.actualCoverageMinutes) * 100)
          : null,
    }))
    .sort((first, second) => second.plannedMinutes - first.plannedMinutes);
}

export function calculateAnalyticsReview(
  input: AnalyticsReviewInput
): AnalyticsReviewResult {
  const trends = input.days.map(toTrendPoint);

  return {
    ...input,
    trends,
    summary: getSummary(input.days),
    topCategories: input.categoryBreakdown.slice(0, 6),
    warningLevel: "good",
  };
}
