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

export const HABIT_CATEGORY_LABELS: Record<HabitCategory, string> = {
  health: "Health",
  study: "Study",
  work: "Work",
  lifestyle: "Lifestyle",
  rest: "Rest",
  discipline: "Discipline",
  personal: "Personal",
};

export const HABIT_STATUS_LABELS: Record<HabitStatus, string> = {
  done: "Done",
  partial: "Partial",
  skipped: "Skipped",
  missed: "Missed",
};

export const HABIT_STATUS_WEIGHTS = {
  done: 1,
  partial: 0.5,
  skipped: 0,
  missed: 0,
} as const;

export const DEFAULT_HABIT_WEIGHT = 5;
export const DEFAULT_TARGET_PER_WEEK = 5;
export const MIN_HABIT_WEIGHT = 1;
export const MAX_HABIT_WEIGHT = 10;
export const MIN_TARGET_PER_WEEK = 1;
export const MAX_TARGET_PER_WEEK = 7;

export type HabitCategory = (typeof HABIT_CATEGORIES)[number];
export type HabitStatus = (typeof HABIT_STATUSES)[number];
