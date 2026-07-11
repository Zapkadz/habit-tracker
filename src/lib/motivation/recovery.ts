import { IDENTITY_REMINDERS, type IdentityReminderKey } from "@/lib/constants/motivation";
import type { AnalyticsDayPoint, AnalyticsSummary } from "@/lib/analytics/trends";

export type RecoveryMessageResult = {
  level: "good" | "notice" | "warning" | "risk";
  title: string;
  message: string;
  action: string;
  identityKey: IdentityReminderKey;
  identityReminder: string;
};

function getLatestTrackedDay(days: AnalyticsDayPoint[]) {
  return [...days].reverse().find((day) => day.score.dataStatus.isComplete) ?? null;
}

export function calculateRecoveryMessage(
  days: AnalyticsDayPoint[],
  summary: AnalyticsSummary
): RecoveryMessageResult {
  const latest = getLatestTrackedDay(days);

  if (!latest) {
    return {
      level: "notice",
      title: "Start with visibility",
      message: "There is not enough recent data to judge recovery yet.",
      action: "Log sleep, one habit status, and a short check-in today.",
      identityKey: "lowData",
      identityReminder: IDENTITY_REMINDERS.lowData,
    };
  }

  if (
    latest.score.warningLevel === "risk" ||
    summary.lowSleepStreak >= 3 ||
    summary.highStressStreak >= 3
  ) {
    return {
      level: "risk",
      title: "Make the next day lighter",
      message:
        "Recent signals show recovery pressure. This is a good moment to reduce load deliberately.",
      action: "Keep only the most important priority and add a real recovery block.",
      identityKey: "recovery",
      identityReminder: IDENTITY_REMINDERS.recovery,
    };
  }

  if (summary.lowRestHeavyFocusDayCount >= 2 || summary.overplannedDayCount >= 2) {
    return {
      level: "warning",
      title: "Do not let focus outrun recovery",
      message:
        "The routine is carrying work, but recovery or planning accuracy is lagging.",
      action: "Shrink one low-priority block or move it to another day.",
      identityKey: "behind",
      identityReminder: IDENTITY_REMINDERS.behind,
    };
  }

  if (summary.averageScore >= 75 && summary.averageHabitCompletion >= 65) {
    return {
      level: "good",
      title: "The rhythm is working",
      message:
        "Recent routine signals are steady. The best move is consistency, not extra difficulty.",
      action: "Repeat the current structure and protect sleep.",
      identityKey: "strong",
      identityReminder: IDENTITY_REMINDERS.strong,
    };
  }

  return {
    level: "notice",
    title: "Keep the day deliberate",
    message:
      "The routine is still forming. A clear, modest day is more useful than a crowded plan.",
    action: "Choose one priority, one recovery block, and one habit to protect.",
    identityKey: "steady",
    identityReminder: IDENTITY_REMINDERS.steady,
  };
}
