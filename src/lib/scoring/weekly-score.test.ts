import assert from "node:assert/strict";
import test from "node:test";
import { calculateWeeklyBalance } from "@/lib/scoring/weekly-score";
import type { DailyBalanceResult } from "@/lib/scoring/types";
import type { DayType } from "@/lib/constants/day-types";

function scoreWithMetrics(focusMinutes: number, restMinutes: number) {
  return {
    dayType: "normal" as DayType,
    metrics: {
      sleepMinutes: 480,
      focusMinutes,
      restMinutes,
      plannedFocusMinutes: focusMinutes,
      plannedRestMinutes: restMinutes,
      actualFocusMinutes: focusMinutes,
      actualRestMinutes: restMinutes,
      plannedMinutes: focusMinutes + restMinutes,
      blockCount: 2,
      completedBlocks: 2,
      skippedBlocks: 0,
      habitCompletionPercent: 100,
      priorityCompletionPercent: 0,
      priorityCount: 0,
      donePriorityCount: 0,
    },
    scores: {
      sleepScore: 100,
      focusScore: 100,
      habitScore: 100,
      restScore: 100,
      moodScore: 80,
      priorityScore: 0,
    },
    dataStatus: {
      state: "complete" as const,
      isComplete: true,
      hasAnyData: true,
      missingSignals: [],
    },
    totalScore: 98,
    scoreLabel: "Excellent" as const,
    warningLevel: "good" as const,
    advice: "Good balance.",
    warnings: [],
  } satisfies DailyBalanceResult;
}

test("suggested recovery day is not selected from the past", () => {
  const balance = calculateWeeklyBalance({
    weekStartDate: "2026-07-06",
    weekEndDate: "2026-07-12",
    referenceDate: "2026-07-11",
    goals: [],
    expectedGoalProgressPercent: 80,
    days: [
      ["2026-07-06", 0, 180],
      ["2026-07-07", 60, 120],
      ["2026-07-08", 120, 90],
      ["2026-07-09", 180, 60],
      ["2026-07-10", 240, 30],
      ["2026-07-11", 90, 60],
      ["2026-07-12", 30, 120],
    ].map(([date, focusMinutes, restMinutes]) => ({
      date: String(date),
      weekdayLabel: String(date),
      shortDateLabel: String(date),
      dayType: "normal",
      hasData: true,
      score: scoreWithMetrics(Number(focusMinutes), Number(restMinutes)),
    })),
  });

  assert.equal(balance.summary.suggestedRecoveryDate, "2026-07-12");
});
