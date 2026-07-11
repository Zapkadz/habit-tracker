import { DAY_TYPE_TARGET_ADJUSTMENTS } from "@/lib/constants/scoring";
import {
  FOCUS_CATEGORIES,
  REST_CATEGORIES,
} from "@/lib/constants/planner";
import { minutesBetween } from "@/lib/dates/time-utils";
import type {
  DailyDataStatus,
  DailyMetrics,
  DailyScoringInput,
  ScoringTimeBlock,
} from "@/lib/scoring/types";

const focusCategories = new Set<string>(FOCUS_CATEGORIES);
const restCategories = new Set<string>(REST_CATEGORIES);

export function getPlannedBlockMinutes(block: ScoringTimeBlock) {
  return minutesBetween(block.plannedStartTime, block.plannedEndTime);
}

export function getActualBlockMinutes(block: ScoringTimeBlock) {
  if (block.status === "skipped") {
    return 0;
  }

  if (typeof block.actualDurationMinutes === "number") {
    return block.actualDurationMinutes;
  }

  if (block.actualStartTime && block.actualEndTime) {
    return minutesBetween(block.actualStartTime, block.actualEndTime);
  }

  return 0;
}

export function isFocusBlock(block: ScoringTimeBlock) {
  return focusCategories.has(block.category);
}

export function isRestBlock(block: ScoringTimeBlock) {
  return restCategories.has(block.category);
}

function hasAnyCheckinValue(input: DailyScoringInput) {
  const { checkin } = input;

  return Boolean(checkin);
}

function hasCompleteCheckin(input: DailyScoringInput) {
  const { checkin } = input;

  return Boolean(
    checkin &&
      typeof checkin.mood === "number" &&
      typeof checkin.motivation === "number" &&
      typeof checkin.stress === "number"
  );
}

function hasAnyHabitLog(input: DailyScoringInput) {
  return input.habits.some((habit) => habit.log);
}

function hasCompleteHabitLogs(input: DailyScoringInput) {
  return (
    input.habits.length === 0 || input.habits.every((habit) => Boolean(habit.log))
  );
}

export function calculateDailyDataStatus(
  input: DailyScoringInput,
  metrics: DailyMetrics
): DailyDataStatus {
  const hasAnyData =
    hasAnyCheckinValue(input) ||
    hasAnyHabitLog(input) ||
    input.priorities.length > 0 ||
    input.timeBlocks.length > 0;

  if (!hasAnyData) {
    return {
      state: "empty",
      isComplete: false,
      hasAnyData: false,
      missingSignals: ["sleep", "check-in", "habits", "focus", "rest"],
    };
  }

  const missingSignals: string[] = [];
  const requiresFocus =
    DAY_TYPE_TARGET_ADJUSTMENTS[input.dayType].lowFocusPenalty === "normal";

  if (metrics.sleepMinutes <= 0) {
    missingSignals.push("sleep");
  }

  if (!hasCompleteCheckin(input)) {
    missingSignals.push("check-in");
  }

  if (!hasCompleteHabitLogs(input)) {
    missingSignals.push("habits");
  }

  if (requiresFocus && metrics.actualFocusMinutes <= 0) {
    missingSignals.push("focus");
  }

  if (metrics.actualRestMinutes <= 0) {
    missingSignals.push("rest");
  }

  return {
    state: missingSignals.length === 0 ? "complete" : "provisional",
    isComplete: missingSignals.length === 0,
    hasAnyData: true,
    missingSignals,
  };
}
