export const WARNING_THRESHOLDS = {
  lowSleepHours: 6,
  strongLowSleepHours: 5,
  overworkFocusHours: 8,
  strongOverworkFocusHours: 9,
  lowRestMinutes: 30,
  minimumRestWithHeavyFocusMinutes: 60,
  lowMotivation: 3,
  highStress: 8,
  manyPlannedBlocks: 10,
  unrealisticPlannedHours: 15,
} as const;

export const WARNING_LEVELS = ["good", "notice", "warning", "risk"] as const;

export type WarningLevel = (typeof WARNING_LEVELS)[number];
