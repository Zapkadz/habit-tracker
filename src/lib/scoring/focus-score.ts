import type { DayType } from "@/lib/constants/day-types";
import { DAY_TYPE_TARGET_ADJUSTMENTS } from "@/lib/constants/scoring";

function clampScore(score: number) {
  return Math.min(Math.max(Math.round(score), 0), 100);
}

export function calculateFocusScore(focusMinutes: number, dayType: DayType) {
  const focusHours = focusMinutes / 60;
  const adjustment = DAY_TYPE_TARGET_ADJUSTMENTS[dayType];

  if (focusHours <= 0) {
    return adjustment.lowFocusPenalty === "soft" ? 80 : 35;
  }

  if (focusHours < 1) {
    return adjustment.lowFocusPenalty === "soft" ? 85 : 55;
  }

  if (adjustment.lowFocusPenalty === "soft" && focusHours < 3) {
    return 95;
  }

  if (focusHours >= 3 && focusHours <= adjustment.focusMaxHours) {
    return 100;
  }

  if (focusHours < 3) {
    return clampScore(65 + focusHours * 10);
  }

  const overloadHours = focusHours - adjustment.focusMaxHours;

  return clampScore(100 - overloadHours * 15);
}
