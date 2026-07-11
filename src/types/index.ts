export type ISODateString = string;
export type ISOTimeString = string;

export type ScoreLabel =
  | "Excellent"
  | "Good"
  | "Okay"
  | "Warning"
  | "Burnout Risk"
  | "Incomplete";

export type TrendDirection = "up" | "down" | "flat";

export type { DayType } from "@/lib/constants/day-types";
export type { HabitCategory, HabitStatus } from "@/lib/constants/habits";
export type {
  DailyPriorityStatus,
  TimeBlockCategory,
  TimeBlockStatus,
} from "@/lib/constants/planner";
