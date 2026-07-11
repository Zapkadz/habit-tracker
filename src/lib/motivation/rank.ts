import { ROUTINE_RANKS } from "@/lib/constants/motivation";
import type { AnalyticsSummary } from "@/lib/analytics/trends";

export type RoutineRankResult = {
  key: string;
  label: string;
  score: number;
  description: string;
  nextTarget: string;
};

const MIN_COMPLETE_DAYS_FOR_RANK = 7;

function getSleepScore(summary: AnalyticsSummary) {
  const hours = summary.averageSleepMinutes / 60;

  if (summary.sleepDayCount === 0) {
    return 45;
  }

  if (hours >= 7 && hours <= 9) {
    return 100;
  }

  if (hours >= 6.5) {
    return 80;
  }

  if (hours >= 6) {
    return 60;
  }

  return 30;
}

function getRiskScore(summary: AnalyticsSummary) {
  if (summary.trackedDayCount === 0) {
    return 50;
  }

  const riskRatio = summary.riskDayCount / summary.trackedDayCount;

  return Math.max(0, Math.round(100 - riskRatio * 160));
}

function getNextTarget(score: number) {
  const nextRank = [...ROUTINE_RANKS]
    .reverse()
    .find((rank) => rank.minScore > score);

  if (!nextRank) {
    return "Maintain the system without adding unnecessary load.";
  }

  return `Reach ${nextRank.minScore} routine points for rank ${nextRank.key}.`;
}

export function calculateRoutineRank(summary: AnalyticsSummary): RoutineRankResult {
  if (summary.trackedDayCount < MIN_COMPLETE_DAYS_FOR_RANK) {
    return {
      key: "Unranked",
      label: "Need More Data",
      score: 0,
      description:
        "Log at least 7 complete days before the routine rank becomes useful.",
      nextTarget: "Complete sleep, habits, focus, rest, and check-in for 7 days.",
    };
  }

  const rankScore = Math.round(
    summary.averageScore * 0.35 +
      summary.averageHabitCompletion * 0.3 +
      getSleepScore(summary) * 0.2 +
      getRiskScore(summary) * 0.15
  );
  const rank =
    ROUTINE_RANKS.find((item) => rankScore >= item.minScore) ??
    ROUTINE_RANKS[ROUTINE_RANKS.length - 1];

  return {
    key: rank.key,
    label: rank.label,
    score: rankScore,
    description: rank.description,
    nextTarget: getNextTarget(rankScore),
  };
}
