import type { DayType } from "@/lib/constants/day-types";

export const DAILY_SCORE_WEIGHTS = {
  sleep: 0.25,
  focus: 0.25,
  habit: 0.25,
  rest: 0.15,
  mood: 0.1,
} as const;

export const SCORE_THRESHOLDS = {
  excellent: 90,
  good: 75,
  okay: 60,
  warning: 40,
  burnoutRisk: 0,
} as const;

export const SCORE_LABELS = {
  excellent: "Excellent",
  good: "Good",
  okay: "Okay",
  warning: "Warning",
  burnoutRisk: "Burnout Risk",
  incomplete: "Incomplete",
} as const;

export const DEFAULT_SLEEP_TARGET_HOURS = {
  min: 7,
  max: 9,
};

export const DEFAULT_FOCUS_TARGET_HOURS = {
  min: 3,
  max: 6,
};

export const DEFAULT_REST_TARGET_MINUTES = {
  min: 60,
  max: 120,
};

export const DAY_TYPE_TARGET_ADJUSTMENTS: Record<
  DayType,
  {
    focusMaxHours: number;
    restMinMinutes: number;
    lowFocusPenalty: "normal" | "soft";
  }
> = {
  normal: { focusMaxHours: 6, restMinMinutes: 60, lowFocusPenalty: "normal" },
  study_sprint: { focusMaxHours: 8, restMinMinutes: 60, lowFocusPenalty: "normal" },
  work_heavy: { focusMaxHours: 8, restMinMinutes: 60, lowFocusPenalty: "normal" },
  recovery: { focusMaxHours: 3, restMinMinutes: 120, lowFocusPenalty: "soft" },
  rest: { focusMaxHours: 2, restMinMinutes: 120, lowFocusPenalty: "soft" },
  deadline: { focusMaxHours: 9, restMinMinutes: 45, lowFocusPenalty: "normal" },
  travel: { focusMaxHours: 4, restMinMinutes: 45, lowFocusPenalty: "soft" },
};
