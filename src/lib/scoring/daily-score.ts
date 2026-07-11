import {
  DAILY_SCORE_WEIGHTS,
  SCORE_LABELS,
  SCORE_THRESHOLDS,
} from "@/lib/constants/scoring";
import {
  calculateDailyDataStatus,
  getActualBlockMinutes,
  getPlannedBlockMinutes,
  isFocusBlock,
  isRestBlock,
} from "@/lib/scoring/data-status";
import { minutesBetween } from "@/lib/dates/time-utils";
import {
  calculateDailyWarnings,
  getDailyAdvice,
  getHighestWarningLevel,
} from "@/lib/warnings/daily-warnings";
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
} from "@/lib/scoring/types";
import type { ScoreLabel } from "@/types";

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
    (sum, block) => sum + getPlannedBlockMinutes(block),
    0
  );
  const plannedFocusMinutes = input.timeBlocks
    .filter(isFocusBlock)
    .reduce((sum, block) => sum + getPlannedBlockMinutes(block), 0);
  const plannedRestMinutes = input.timeBlocks
    .filter(isRestBlock)
    .reduce((sum, block) => sum + getPlannedBlockMinutes(block), 0);
  const sleepBlockMinutes = input.timeBlocks
    .filter((block) => block.category === "sleep")
    .reduce((sum, block) => sum + getActualBlockMinutes(block), 0);
  const checkinSleepMinutes =
    input.checkin?.sleepStart && input.checkin?.wakeTime
      ? minutesBetween(input.checkin.sleepStart, input.checkin.wakeTime)
      : 0;
  const focusMinutes = input.timeBlocks
    .filter(isFocusBlock)
    .reduce((sum, block) => sum + getActualBlockMinutes(block), 0);
  const restMinutes = input.timeBlocks
    .filter(isRestBlock)
    .reduce((sum, block) => sum + getActualBlockMinutes(block), 0);
  const donePriorityCount = input.priorities.filter(
    (priority) => priority.status === "done"
  ).length;

  return {
    sleepMinutes: sleepBlockMinutes || checkinSleepMinutes,
    focusMinutes,
    restMinutes,
    plannedFocusMinutes,
    plannedRestMinutes,
    actualFocusMinutes: focusMinutes,
    actualRestMinutes: restMinutes,
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
  const dataStatus = calculateDailyDataStatus(input, metrics);
  const scores = {
    sleepScore: calculateSleepScore(metrics.sleepMinutes),
    focusScore: calculateFocusScore(metrics.focusMinutes, input.dayType),
    habitScore: calculateHabitScore(input.habits),
    restScore: calculateRestScore(metrics.restMinutes, input.dayType),
    moodScore: calculateMoodScore(input.checkin),
    priorityScore: calculatePriorityScore(input.priorities),
  };
  const rawTotalScore = roundScore(
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
    dataStatus,
  });
  const totalScore = dataStatus.isComplete ? rawTotalScore : 0;

  return {
    dayType: input.dayType,
    metrics,
    scores,
    dataStatus,
    totalScore,
    scoreLabel: dataStatus.isComplete
      ? getScoreLabel(totalScore)
      : SCORE_LABELS.incomplete,
    warningLevel: getHighestWarningLevel(warnings),
    advice: getDailyAdvice(warnings, totalScore),
    warnings,
  };
}
