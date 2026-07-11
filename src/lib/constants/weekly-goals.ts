export const WEEKLY_GOAL_CATEGORIES = [
  "study",
  "work",
  "health",
  "rest",
  "discipline",
  "personal",
] as const;

export type WeeklyGoalCategory = (typeof WEEKLY_GOAL_CATEGORIES)[number];

export const WEEKLY_GOAL_CATEGORY_LABELS: Record<WeeklyGoalCategory, string> = {
  study: "Study",
  work: "Work",
  health: "Health",
  rest: "Rest",
  discipline: "Discipline",
  personal: "Personal",
};

export const WEEKLY_GOAL_UNITS = [
  "hours",
  "sessions",
  "days",
  "tasks",
  "points",
] as const;

export const DEFAULT_WEEKLY_GOAL_UNIT = "hours";
