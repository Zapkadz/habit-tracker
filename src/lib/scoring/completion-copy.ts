import type { DailyDataStatus } from "@/lib/scoring/types";

export type CompletionSignalId = "sleep" | "check-in" | "habits" | "focus" | "rest";

export type CompletionSignalCopy = {
  id: CompletionSignalId;
  label: string;
  description: string;
  href: string;
};

const completionCopy: Record<CompletionSignalId, CompletionSignalCopy> = {
  sleep: {
    id: "sleep",
    label: "Sleep",
    description: "Add sleep start and wake time, or record a completed sleep block.",
    href: "#daily-checkin",
  },
  "check-in": {
    id: "check-in",
    label: "Check-in",
    description: "Fill mood, motivation, and stress so the score has context.",
    href: "#daily-checkin",
  },
  habits: {
    id: "habits",
    label: "Habit logs",
    description: "Mark each visible habit as done, partial, skipped, or missed.",
    href: "#habit-checklist",
  },
  focus: {
    id: "focus",
    label: "Actual focus",
    description: "Mark a focus block done or add actual minutes for study/work.",
    href: "#timeline",
  },
  rest: {
    id: "rest",
    label: "Actual rest",
    description: "Record real rest, meal, exercise, or personal recovery time.",
    href: "#timeline",
  },
};

function isCompletionSignal(value: string): value is CompletionSignalId {
  return value in completionCopy;
}

export function getCompletionMissingItems(
  missingSignals: DailyDataStatus["missingSignals"]
) {
  return missingSignals.filter(isCompletionSignal).map((item) => completionCopy[item]);
}

export function getCompletionTitle(dataStatus: DailyDataStatus) {
  if (dataStatus.isComplete) {
    return "Day is complete";
  }

  if (dataStatus.state === "empty") {
    return "Start today's log";
  }

  return "Complete this day";
}

export function getCompletionMessage(dataStatus: DailyDataStatus) {
  if (dataStatus.isComplete) {
    return "This day has enough data for score, streak, rank, and analytics.";
  }

  if (dataStatus.state === "empty") {
    return "Add the first few signals so the app can judge the day fairly.";
  }

  return "These missing signals are why the daily score is still incomplete.";
}
