import type { ScoringPriority } from "@/lib/scoring/types";

const priorityStatusWeights = {
  planned: 0,
  done: 1,
  partial: 0.5,
  skipped: 0,
} as const;

export function calculatePriorityScore(priorities: ScoringPriority[]) {
  if (priorities.length === 0) {
    return 0;
  }

  const completed = priorities.reduce(
    (sum, priority) => sum + priorityStatusWeights[priority.status],
    0
  );

  return Math.round((completed / priorities.length) * 100);
}
