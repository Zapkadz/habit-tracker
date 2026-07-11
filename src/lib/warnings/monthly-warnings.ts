import type { WarningLevel } from "@/lib/constants/warnings";
import type { MonthlyReviewResult } from "@/lib/scoring/monthly-score";

export type MonthlyWarning = {
  id: string;
  level: WarningLevel;
  title: string;
  message: string;
};

const warningRank: Record<WarningLevel, number> = {
  good: 0,
  notice: 1,
  warning: 2,
  risk: 3,
};

export function getHighestMonthlyWarningLevel(warnings: MonthlyWarning[]) {
  return warnings.reduce<WarningLevel>(
    (highest, warning) =>
      warningRank[warning.level] > warningRank[highest]
        ? warning.level
        : highest,
    "good"
  );
}

export function calculateMonthlyWarnings(
  review: MonthlyReviewResult
): MonthlyWarning[] {
  const { stats } = review;
  const warnings: MonthlyWarning[] = [];

  if (stats.trackedDayCount === 0) {
    return [
      {
        id: "no-monthly-data",
        level: "notice",
        title: "No monthly data yet",
        message:
          "Log habits or check-ins from Today so the monthly review can show real consistency signals.",
      },
    ];
  }

  if (stats.completionPercent < 35 && stats.elapsedDayCount >= 7) {
    warnings.push({
      id: "low-monthly-completion",
      level: "warning",
      title: "Monthly consistency is low",
      message:
        "Habit completion is below 35%. Pick one or two important habits to stabilize before expanding the routine.",
    });
  } else if (stats.completionPercent < 55 && stats.elapsedDayCount >= 7) {
    warnings.push({
      id: "soft-monthly-completion",
      level: "notice",
      title: "Consistency needs attention",
      message:
        "Completion is under 55%. The month is still workable if the next week becomes simpler and more repeatable.",
    });
  }

  if (
    stats.sleepDayCount >= 5 &&
    stats.averageSleepMinutes > 0 &&
    stats.averageSleepMinutes < 6 * 60
  ) {
    warnings.push({
      id: "monthly-sleep-risk",
      level: "risk",
      title: "Sleep average is risky",
      message:
        "Average logged sleep is under 6 hours. Treat sleep as a recovery goal for the next review cycle.",
    });
  } else if (
    stats.sleepDayCount >= 5 &&
    stats.averageSleepMinutes > 0 &&
    stats.averageSleepMinutes < 6.5 * 60
  ) {
    warnings.push({
      id: "monthly-sleep-warning",
      level: "warning",
      title: "Sleep average is low",
      message:
        "Average logged sleep is below 6.5 hours. A small bedtime rule may help more than adding another productivity block.",
    });
  }

  if (typeof stats.averageStress === "number" && stats.averageStress >= 7) {
    warnings.push({
      id: "monthly-stress-high",
      level: "warning",
      title: "Stress trend is high",
      message:
        "Average stress is high across logged check-ins. Look for a lighter week or fewer hard blocks next month.",
    });
  }

  if (stats.weakHabitCount >= 3) {
    warnings.push({
      id: "many-weak-habits",
      level: "notice",
      title: "Several habits are weak",
      message:
        "Multiple habits are under 50%. Consider lowering targets or separating must-do habits from optional ones.",
    });
  }

  if (stats.trendDirection === "declining") {
    warnings.push({
      id: "monthly-declining",
      level: "warning",
      title: "Recent days are declining",
      message:
        "The last week is weaker than the previous one. Make the next plan smaller before trying to recover momentum.",
    });
  }

  if (warnings.length === 0) {
    warnings.push({
      id: "monthly-balance-good",
      level: "good",
      title: "Month looks steady",
      message:
        "The review has no major warning. Keep the routine readable and protect sleep before adding more goals.",
    });
  }

  return warnings;
}
