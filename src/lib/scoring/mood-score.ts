import type { ScoringCheckin } from "@/lib/scoring/types";

function average(values: number[]) {
  if (values.length === 0) {
    return 5;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function clampScore(score: number) {
  return Math.min(Math.max(Math.round(score), 0), 100);
}

export function calculateMoodScore(checkin: ScoringCheckin) {
  const moodValues = [checkin?.mood, checkin?.motivation].filter(
    (value): value is number => typeof value === "number"
  );
  const baseScore = average(moodValues) * 10;
  const stress = checkin?.stress;

  if (typeof stress !== "number") {
    return clampScore(baseScore);
  }

  if (stress >= 8) {
    return clampScore(baseScore - 20);
  }

  if (stress >= 6) {
    return clampScore(baseScore - 10);
  }

  return clampScore(baseScore);
}
