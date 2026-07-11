import type { WarningLevel } from "@/lib/constants/warnings";
import type { AnalyticsReviewResult } from "@/lib/analytics/trends";

export type AnalyticsWarning = {
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

export function getHighestAnalyticsWarningLevel(warnings: AnalyticsWarning[]) {
  return warnings.reduce<WarningLevel>(
    (highest, warning) =>
      warningRank[warning.level] > warningRank[highest]
        ? warning.level
        : highest,
    "good"
  );
}

export function calculateAnalyticsWarnings(
  review: AnalyticsReviewResult
): AnalyticsWarning[] {
  const { summary } = review;
  const warnings: AnalyticsWarning[] = [];

  if (summary.trackedDayCount === 0) {
    return [
      {
        id: "no-analytics-data",
        level: "notice",
        title: "No analytics data yet",
        message:
          "Log habits, check-ins, and time blocks from Today so long-range patterns become visible.",
      },
    ];
  }

  if (summary.riskDayCount >= 3) {
    warnings.push({
      id: "many-risk-days",
      level: "risk",
      title: "Repeated risk days",
      message:
        "This range contains several risk-level days. Reduce load before adding new goals or longer focus blocks.",
    });
  } else if (summary.riskDayCount > 0) {
    warnings.push({
      id: "some-risk-days",
      level: "warning",
      title: "Risk days appeared",
      message:
        "At least one day crossed into risk. Check whether low sleep, low rest, or high workload caused it.",
    });
  }

  if (
    summary.sleepDayCount >= 4 &&
    summary.averageSleepMinutes > 0 &&
    summary.averageSleepMinutes < 6 * 60
  ) {
    warnings.push({
      id: "very-low-sleep-average",
      level: "risk",
      title: "Average sleep is very low",
      message:
        "Logged sleep averages under 6 hours. Make sleep protection the first adjustment, not the last.",
    });
  } else if (
    summary.sleepDayCount >= 4 &&
    summary.averageSleepMinutes > 0 &&
    summary.averageSleepMinutes < 6.5 * 60
  ) {
    warnings.push({
      id: "low-sleep-average",
      level: "warning",
      title: "Average sleep is low",
      message:
        "Sleep average is below 6.5 hours. A smaller evening plan may recover more progress than another task.",
    });
  }

  if (summary.lowSleepStreak >= 3) {
    warnings.push({
      id: "low-sleep-streak",
      level: "warning",
      title: "Sleep debt streak",
      message:
        "There are at least 3 consecutive low-sleep logged days. Add a recovery night before a heavy day.",
    });
  }

  if (summary.highStressStreak >= 3) {
    warnings.push({
      id: "high-stress-streak",
      level: "warning",
      title: "Stress stayed high",
      message:
        "Stress was high for 3 or more consecutive check-ins. Shrink the next plan and add a clear shutdown block.",
    });
  }

  if (summary.lowRestHeavyFocusDayCount >= 3) {
    warnings.push({
      id: "low-rest-heavy-focus",
      level: "warning",
      title: "Focus is outrunning recovery",
      message:
        "Several days had high focus with low rest. Add recovery blocks near hard work, not only after everything is done.",
    });
  }

  if (
    typeof summary.planAccuracyPercent === "number" &&
    summary.actualCoverageMinutes >= 3 * 60 &&
    summary.planAccuracyPercent < 65
  ) {
    warnings.push({
      id: "weak-plan-accuracy",
      level: "notice",
      title: "Planning accuracy is weak",
      message:
        "Actual duration often differs from planned duration. Shorten block scope or record actual time more consistently.",
    });
  }

  if (summary.habitTrendDirection === "down") {
    warnings.push({
      id: "habit-trend-declining",
      level: "notice",
      title: "Habit consistency is declining",
      message:
        "Recent habit completion is weaker than the earlier part of this range. Choose fewer must-do habits for the next stretch.",
    });
  }

  if (warnings.length === 0) {
    warnings.push({
      id: "analytics-steady",
      level: "good",
      title: "Routine signals look steady",
      message:
        "No major long-range warning is visible in this range. Keep logging actual durations to sharpen the analysis.",
    });
  }

  return warnings;
}
