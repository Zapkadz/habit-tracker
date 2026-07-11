import {
  DAILY_SCORE_WEIGHTS,
  SCORE_LABELS,
  SCORE_THRESHOLDS,
} from "@/lib/constants/scoring";
import {
  FOCUS_CATEGORIES,
  REST_CATEGORIES,
} from "@/lib/constants/planner";
import { minutesBetween } from "@/lib/dates/time-utils";
import { calculateDailyWarnings, getDailyAdvice, getHighestWarningLevel } from "@/lib/warnings/daily-warnings";
import { calculateFocusScore } from "@/lib/scoring/focus-score";
import { calculateHabitScore } from "@/lib/scoring/habit-score";
import { calculateMoodScore } from "@/lib/scoring/mood-score";
import { calculatePriorityScore } from "@/lib/scoring/priority-score";
import { calculateRestScore } from "@/lib/scoring/rest-score";
import { calculateSleepScore } from "@/lib/scoring/sleep-score";
import type {
  DailyBalanceResult,
  DailyMetrics,
  DailyScoringInput,
  ScoringTimeBlock,
} from "@/lib/scoring/types";
import type { ScoreLabel } from "@/types";

const focusCategories = new Set<string>(FOCUS_CATEGORIES);
const restCategories = new Set<string>(REST_CATEGORIES);

function blockPlannedMinutes(block: ScoringTimeBlock) {
  return minutesBetween(block.plannedStartTime, block.plannedEndTime);
}

function blockUsefulMinutes(block: ScoringTimeBlock) {
  if (block.status === "skipped") {
    return 0;
  }

  return block.actualDurationMinutes ?? blockPlannedMinutes(block);
}

function roundScore(score: number) {
  return Math.min(Math.max(Math.round(score), 0), 100);
}

function getScoreLabel(score: number): ScoreLabel {
  if (score >= SCORE_THRESHOLDS.excellent) {
    return SCORE_LABELS.excellent;
  }

  if (score >= SCORE_THRESHOLDS.good) {
    return SCORE_LABELS.good;
  }

  if (score >= SCORE_THRESHOLDS.okay) {
    return SCORE_LABELS.okay;
  }

  if (score >= SCORE_THRESHOLDS.warning) {
    return SCORE_LABELS.warning;
  }

  return SCORE_LABELS.burnoutRisk;
}

function calculateHabitCompletionPercent(input: DailyScoringInput) {
  return calculateHabitScore(input.habits);
}

function calculateMetrics(input: DailyScoringInput): DailyMetrics {
  const plannedMinutes = input.timeBlocks.reduce(
    (sum, block) => sum + blockPlannedMinutes(block),
    0
  );
  const sleepBlockMinutes = input.timeBlocks
    .filter((block) => block.category === "sleep")
    .reduce((sum, block) => sum + blockUsefulMinutes(block), 0);
  const checkinSleepMinutes =
    input.checkin?.sleepStart && input.checkin?.wakeTime
      ? minutesBetween(input.checkin.sleepStart, input.checkin.wakeTime)
      : 0;
  const focusMinutes = input.timeBlocks
    .filter((block) => focusCategories.has(block.category))
    .reduce((sum, block) => sum + blockUsefulMinutes(block), 0);
  const restMinutes = input.timeBlocks
    .filter((block) => restCategories.has(block.category))
    .reduce((sum, block) => sum + blockUsefulMinutes(block), 0);
  const donePriorityCount = input.priorities.filter(
    (priority) => priority.status === "done"
  ).length;

  return {
    sleepMinutes: sleepBlockMinutes || checkinSleepMinutes,
    focusMinutes,
    restMinutes,
    plannedMinutes,
    blockCount: input.timeBlocks.length,
    completedBlocks: input.timeBlocks.filter((block) => block.status === "done")
      .length,
    skippedBlocks: input.timeBlocks.filter((block) => block.status === "skipped")
      .length,
    habitCompletionPercent: calculateHabitCompletionPercent(input),
    priorityCompletionPercent: calculatePriorityScore(input.priorities),
    priorityCount: input.priorities.length,
    donePriorityCount,
  };
}

export function calculateDailyBalance(
  input: DailyScoringInput
): DailyBalanceResult {
  const metrics = calculateMetrics(input);
  const scores = {
    sleepScore: calculateSleepScore(metrics.sleepMinutes),
    focusScore: calculateFocusScore(metrics.focusMinutes, input.dayType),
    habitScore: calculateHabitScore(input.habits),
    restScore: calculateRestScore(metrics.restMinutes, input.dayType),
    moodScore: calculateMoodScore(input.checkin),
    priorityScore: calculatePriorityScore(input.priorities),
  };
  const totalScore = roundScore(
    scores.sleepScore * DAILY_SCORE_WEIGHTS.sleep +
      scores.focusScore * DAILY_SCORE_WEIGHTS.focus +
      scores.habitScore * DAILY_SCORE_WEIGHTS.habit +
      scores.restScore * DAILY_SCORE_WEIGHTS.rest +
      scores.moodScore * DAILY_SCORE_WEIGHTS.mood
  );
  const warnings = calculateDailyWarnings({
    dayType: input.dayType,
    metrics,
    checkin: input.checkin,
    scores,
  });

  return {
    dayType: input.dayType,
    metrics,
    scores,
    totalScore,
    scoreLabel: getScoreLabel(totalScore),
    warningLevel: getHighestWarningLevel(warnings),
    advice: getDailyAdvice(warnings, totalScore),
    warnings,
  };
}
