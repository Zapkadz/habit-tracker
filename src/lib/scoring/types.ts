import type { DayType } from "@/lib/constants/day-types";
import type { HabitStatus } from "@/lib/constants/habits";
import type {
  DailyPriorityStatus,
  TimeBlockCategory,
  TimeBlockStatus,
} from "@/lib/constants/planner";
import type { WarningLevel } from "@/lib/constants/warnings";
import type { ScoreLabel } from "@/types";

export type ScoringCheckin = {
  dayType?: DayType | null;
  sleepStart?: string | null;
  wakeTime?: string | null;
  mood?: number | null;
  motivation?: number | null;
  stress?: number | null;
} | null;

export type ScoringHabit = {
  weight: number;
  log?: {
    status: HabitStatus;
  } | null;
};

export type ScoringPriority = {
  status: DailyPriorityStatus;
};

export type ScoringTimeBlock = {
  category: TimeBlockCategory;
  plannedStartTime: string;
  plannedEndTime: string;
  actualDurationMinutes?: number | null;
  status: TimeBlockStatus;
};

export type DailyScoringInput = {
  dayType: DayType;
  checkin: ScoringCheckin;
  habits: ScoringHabit[];
  priorities: ScoringPriority[];
  timeBlocks: ScoringTimeBlock[];
};

export type DailyMetrics = {
  sleepMinutes: number;
  focusMinutes: number;
  restMinutes: number;
  plannedMinutes: number;
  blockCount: number;
  completedBlocks: number;
  skippedBlocks: number;
  habitCompletionPercent: number;
  priorityCompletionPercent: number;
  priorityCount: number;
  donePriorityCount: number;
};

export type DailyComponentScores = {
  sleepScore: number;
  focusScore: number;
  habitScore: number;
  restScore: number;
  moodScore: number;
  priorityScore: number;
};

export type DailyWarning = {
  id: string;
  level: WarningLevel;
  title: string;
  message: string;
};

export type DailyBalanceResult = {
  dayType: DayType;
  metrics: DailyMetrics;
  scores: DailyComponentScores;
  totalScore: number;
  scoreLabel: ScoreLabel;
  warningLevel: WarningLevel;
  advice: string;
  warnings: DailyWarning[];
};
