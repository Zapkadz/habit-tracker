import type { DayType } from "@/lib/constants/day-types";
import { DAY_TYPE_TARGET_ADJUSTMENTS } from "@/lib/constants/scoring";

function clampScore(score: number) {
  return Math.min(Math.max(Math.round(score), 0), 100);
}

export function calculateRestScore(restMinutes: number, dayType: DayType) {
  const target = DAY_TYPE_TARGET_ADJUSTMENTS[dayType].restMinMinutes;

  if (restMinutes <= 0) {
    return 20;
  }

  if (restMinutes < 30) {
    return 40;
  }

  if (restMinutes >= target && restMinutes <= target * 2) {
    return 100;
  }

  if (restMinutes < target) {
    return clampScore(50 + (restMinutes / target) * 45);
  }

  return 90;
}
