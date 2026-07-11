import type { DayType } from "@/lib/constants/day-types";
import { getTodayDateString } from "@/lib/dates/date-utils";
import type { DailyBalanceResult } from "@/lib/scoring/types";

export type WeeklyGoalSource = {
  id: string;
  title: string;
  category: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  createdAt: Date;
  updatedAt: Date;
};

export type WeeklyGoalProgress = WeeklyGoalSource & {
  progressPercent: number;
  expectedPercent: number;
  isBehind: boolean;
};

export type WeeklyBalanceDay = {
  date: string;
  weekdayLabel: string;
  shortDateLabel: string;
  dayType: DayType;
  hasData: boolean;
  score: DailyBalanceResult;
};

export type WeeklyBalanceSummary = {
  weekScore: number;
  trackedDayCount: number;
  averageSleepMinutes: number;
  sleepDayCount: number;
  totalFocusMinutes: number;
  totalRestMinutes: number;
  overloadedDayCount: number;
  recoveryDayCount: number;
  warningDayCount: number;
  riskDayCount: number;
  behindGoalCount: number;
  suggestedRecoveryDate: string | null;
  suggestedRecoveryLabel: string | null;
};

export type WeeklyBalanceInput = {
  weekStartDate: string;
  weekEndDate: string;
  days: WeeklyBalanceDay[];
  goals: WeeklyGoalSource[];
  expectedGoalProgressPercent: number;
  referenceDate?: string;
};

export type WeeklyBalanceResult = {
  weekStartDate: string;
  weekEndDate: string;
  days: WeeklyBalanceDay[];
  goals: WeeklyGoalProgress[];
  summary: WeeklyBalanceSummary;
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

function getGoalProgress(goal: WeeklyGoalSource, expectedPercent: number) {
  const progressPercent =
    goal.targetValue > 0
      ? Math.round((goal.currentValue / goal.targetValue) * 100)
      : 100;

  return {
    ...goal,
    progressPercent,
    expectedPercent,
    isBehind: progressPercent + 10 < expectedPercent,
  };
}

function isOverloadedDay(day: WeeklyBalanceDay) {
  return (
    day.hasData &&
    (day.score.metrics.focusMinutes >= 8 * 60 ||
      day.score.metrics.plannedMinutes >= 15 * 60)
  );
}

function isRecoveryDay(day: WeeklyBalanceDay) {
  return (
    day.dayType === "recovery" ||
    day.dayType === "rest" ||
    day.score.metrics.restMinutes >= 90
  );
}

function getSuggestedRecoveryDay(days: WeeklyBalanceDay[], referenceDate: string) {
  const candidateDays = days.filter((day) => day.date >= referenceDate);

  if (candidateDays.length === 0) {
    return null;
  }

  return [...candidateDays].sort((first, second) => {
    const firstFocus = first.score.metrics.focusMinutes;
    const secondFocus = second.score.metrics.focusMinutes;
    const firstRest = first.score.metrics.restMinutes;
    const secondRest = second.score.metrics.restMinutes;

    if (firstFocus !== secondFocus) {
      return firstFocus - secondFocus;
    }

    return secondRest - firstRest;
  })[0];
}

export function calculateWeeklyBalance(
  input: WeeklyBalanceInput
): WeeklyBalanceResult {
  const completeDays = input.days.filter((day) => day.score.dataStatus.isComplete);
  const sleepMinutes = completeDays
    .map((day) => day.score.metrics.sleepMinutes)
    .filter((minutes) => minutes > 0);
  const goals = input.goals.map((goal) =>
    getGoalProgress(goal, input.expectedGoalProgressPercent)
  );
  const suggestedRecoveryDay = getSuggestedRecoveryDay(
    input.days,
    input.referenceDate ?? getTodayDateString()
  );

  return {
    weekStartDate: input.weekStartDate,
    weekEndDate: input.weekEndDate,
    days: input.days,
    goals,
    summary: {
      weekScore: round(average(completeDays.map((day) => day.score.totalScore))),
      trackedDayCount: completeDays.length,
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
      overloadedDayCount: input.days.filter(isOverloadedDay).length,
      recoveryDayCount: input.days.filter(isRecoveryDay).length,
      warningDayCount: completeDays.filter(
        (day) => day.score.warningLevel === "warning"
      ).length,
      riskDayCount: completeDays.filter((day) => day.score.warningLevel === "risk")
        .length,
      behindGoalCount: goals.filter((goal) => goal.isBehind).length,
      suggestedRecoveryDate: suggestedRecoveryDay?.date ?? null,
      suggestedRecoveryLabel: suggestedRecoveryDay
        ? `${suggestedRecoveryDay.weekdayLabel}, ${suggestedRecoveryDay.shortDateLabel}`
        : null,
    },
  };
}
