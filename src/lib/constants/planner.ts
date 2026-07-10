export const TIME_BLOCK_CATEGORIES = [
  "sleep",
  "deep_work",
  "study",
  "work",
  "rest",
  "exercise",
  "entertainment",
  "personal",
  "meal",
  "commute",
  "social",
  "other",
] as const;

export const TIME_BLOCK_STATUSES = [
  "planned",
  "done",
  "partial",
  "skipped",
] as const;

export const DAILY_PRIORITY_STATUSES = [
  "planned",
  "done",
  "partial",
  "skipped",
] as const;

export const MAX_DAILY_PRIORITIES = 3;
export const FOCUS_CATEGORIES = ["deep_work", "study", "work"] as const;
export const REST_CATEGORIES = ["rest", "exercise", "meal", "personal"] as const;

export type TimeBlockCategory = (typeof TIME_BLOCK_CATEGORIES)[number];
export type TimeBlockStatus = (typeof TIME_BLOCK_STATUSES)[number];
export type DailyPriorityStatus = (typeof DAILY_PRIORITY_STATUSES)[number];

export const TIME_BLOCK_CATEGORY_LABELS: Record<TimeBlockCategory, string> = {
  sleep: "Sleep",
  deep_work: "Deep Work",
  study: "Study",
  work: "Work",
  rest: "Rest",
  exercise: "Exercise",
  entertainment: "Entertainment",
  personal: "Personal",
  meal: "Meal",
  commute: "Commute",
  social: "Social",
  other: "Other",
};

export const TIME_BLOCK_STATUS_LABELS: Record<TimeBlockStatus, string> = {
  planned: "Planned",
  done: "Done",
  partial: "Partial",
  skipped: "Skipped",
};

export const DAILY_PRIORITY_STATUS_LABELS: Record<
  DailyPriorityStatus,
  string
> = {
  planned: "Planned",
  done: "Done",
  partial: "Partial",
  skipped: "Skipped",
};
