import type { WarningLevel } from "@/lib/constants/warnings";
import type { WeeklyBalanceResult } from "@/lib/scoring/weekly-score";

export type WeeklyWarning = {
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

export function getHighestWeeklyWarningLevel(warnings: WeeklyWarning[]) {
  return warnings.reduce<WarningLevel>(
    (highest, warning) =>
      warningRank[warning.level] > warningRank[highest]
        ? warning.level
        : highest,
    "good"
  );
}

export function calculateWeeklyWarnings(
  balance: WeeklyBalanceResult
): WeeklyWarning[] {
  const { summary } = balance;
  const warnings: WeeklyWarning[] = [];
  const averageSleepHours = summary.averageSleepMinutes / 60;
  const averageRestMinutes =
    summary.trackedDayCount > 0
      ? summary.totalRestMinutes / summary.trackedDayCount
      : 0;
  const behindGoals = balance.goals.filter((goal) => goal.isBehind);

  if (summary.trackedDayCount === 0) {
    return [
      {
        id: "no-weekly-data",
        level: "notice",
        title: "No weekly data yet",
        message:
          "Plan a few days or log check-ins from Today so this page can judge the week fairly.",
      },
    ];
  }

  if (summary.riskDayCount >= 2) {
    warnings.push({
      id: "multiple-risk-days",
      level: "risk",
      title: "Multiple high-risk days",
      message:
        "This week already has at least two risk-level days. Reduce one low-priority load and protect sleep before adding more work.",
    });
  }

  if (summary.overloadedDayCount >= 3) {
    warnings.push({
      id: "too-many-heavy-days",
      level: "warning",
      title: "Too many heavy days",
      message:
        "Three or more days look overloaded. Keep the hardest block, but move or shrink one secondary block.",
    });
  }

  if (summary.sleepDayCount >= 2 && averageSleepHours < 6) {
    warnings.push({
      id: "very-low-average-sleep",
      level: "risk",
      title: "Average sleep is very low",
      message:
        "Average sleep is under 6 hours on logged nights. Treat recovery as part of the plan, not as leftover time.",
    });
  } else if (summary.sleepDayCount >= 2 && averageSleepHours < 6.5) {
    warnings.push({
      id: "low-average-sleep",
      level: "warning",
      title: "Average sleep is low",
      message:
        "Weekly sleep average is below a healthy baseline. Add an earlier shutdown block for one or two nights.",
    });
  }

  if (
    summary.trackedDayCount >= 3 &&
    averageRestMinutes < 45 &&
    summary.totalFocusMinutes >= 12 * 60
  ) {
    warnings.push({
      id: "low-weekly-rest",
      level: "warning",
      title: "Recovery is thin",
      message:
        "Focus time is building up, but average rest is under 45 minutes on complete days. Add a real recovery block.",
    });
  }

  if (summary.recoveryDayCount === 0 && summary.totalFocusMinutes >= 18 * 60) {
    warnings.push({
      id: "missing-recovery-day",
      level: "warning",
      title: "No recovery day yet",
      message: summary.suggestedRecoveryLabel
        ? `Consider making ${summary.suggestedRecoveryLabel} lighter or recovery-focused.`
        : "Consider making one day lighter or recovery-focused.",
    });
  }

  if (behindGoals.length > 0) {
    warnings.push({
      id: "goals-behind",
      level: behindGoals.length >= 2 ? "warning" : "notice",
      title: "Weekly goal progress is behind",
      message:
        behindGoals.length === 1
          ? `${behindGoals[0].title} is behind the expected pace for this week.`
          : `${behindGoals.length} goals are behind the expected pace for this week.`,
    });
  }

  if (warnings.length === 0) {
    warnings.push({
      id: "weekly-balance-good",
      level: "good",
      title: "Week looks manageable",
      message:
        "Tracked days look reasonably balanced. Keep checking sleep and rest before adding extra workload.",
    });
  }

  return warnings;
}
