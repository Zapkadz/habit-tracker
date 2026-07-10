export const HABIT_CATEGORIES = [
  "health",
  "study",
  "work",
  "lifestyle",
  "rest",
  "discipline",
  "personal",
] as const;

export const HABIT_STATUSES = ["done", "partial", "skipped", "missed"] as const;

export const HABIT_STATUS_WEIGHTS = {
  done: 1,
  partial: 0.5,
  skipped: 0,
  missed: 0,
} as const;

export const DEFAULT_HABIT_WEIGHT = 5;
export const DEFAULT_TARGET_PER_WEEK = 5;

export type HabitCategory = (typeof HABIT_CATEGORIES)[number];
export type HabitStatus = (typeof HABIT_STATUSES)[number];
