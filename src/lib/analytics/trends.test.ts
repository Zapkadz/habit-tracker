import assert from "node:assert/strict";
import test from "node:test";
import { calculateAnalyticsReview } from "@/lib/analytics/trends";
import { calculateRoutineRank } from "@/lib/motivation/rank";
import type { AnalyticsDayPoint } from "@/lib/analytics/trends";
import type { DailyBalanceResult } from "@/lib/scoring/types";

function score({
  sleepMinutes,
  complete,
}: {
  sleepMinutes: number;
  complete: boolean;
}) {
  return {
    dayType: "normal",
    metrics: {
      sleepMinutes,
      focusMinutes: complete ? 180 : 0,
      restMinutes: complete ? 60 : 0,
      plannedFocusMinutes: complete ? 180 : 0,
      plannedRestMinutes: complete ? 60 : 0,
      actualFocusMinutes: complete ? 180 : 0,
      actualRestMinutes: complete ? 60 : 0,
      plannedMinutes: complete ? 240 : 0,
      blockCount: complete ? 2 : 0,
      completedBlocks: complete ? 2 : 0,
      skippedBlocks: 0,
      habitCompletionPercent: complete ? 100 : 0,
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
      state: complete ? "complete" : "provisional",
      isComplete: complete,
      hasAnyData: true,
      missingSignals: complete ? [] : ["sleep"],
    },
    totalScore: complete ? 98 : 0,
    scoreLabel: complete ? "Excellent" : "Incomplete",
    warningLevel: "good",
    advice: "Good balance.",
    warnings: [],
  } satisfies DailyBalanceResult;
}

function day(date: string, complete: boolean): AnalyticsDayPoint {
  return {
    date,
    label: date,
    dayType: "normal",
    hasData: true,
    score: score({ sleepMinutes: complete ? 300 : 0, complete }),
    mood: complete ? 7 : null,
    motivation: complete ? 7 : null,
    stress: complete ? 3 : null,
    plannedMinutes: 240,
    actualMinutes: complete ? 240 : null,
    actualCoverageMinutes: complete ? 240 : 0,
    planAccuracyPercent: complete ? 100 : null,
    skippedBlockCount: 0,
  };
}

test("low sleep streak resets across incomplete calendar days", () => {
  const review = calculateAnalyticsReview({
    startDate: "2026-07-01",
    endDate: "2026-07-03",
    presetDays: null,
    label: "Test range",
    categoryBreakdown: [],
    days: [
      day("2026-07-01", true),
      day("2026-07-02", false),
      day("2026-07-03", true),
    ],
  });

  assert.equal(review.summary.lowSleepStreak, 1);
});

test("routine rank is unranked before seven complete days", () => {
  const review = calculateAnalyticsReview({
    startDate: "2026-07-01",
    endDate: "2026-07-06",
    presetDays: null,
    label: "Test range",
    categoryBreakdown: [],
    days: Array.from({ length: 6 }, (_, index) =>
      day(`2026-07-0${index + 1}`, true)
    ),
  });

  const rank = calculateRoutineRank(review.summary);

  assert.equal(rank.key, "Unranked");
});
