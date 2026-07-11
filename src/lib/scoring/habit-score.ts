import { HABIT_STATUS_WEIGHTS } from "@/lib/constants/habits";
import type { ScoringHabit } from "@/lib/scoring/types";

export function calculateHabitScore(habits: ScoringHabit[]) {
  const totalWeight = habits.reduce((sum, habit) => sum + habit.weight, 0);

  if (totalWeight === 0) {
    return 100;
  }

  const completedWeight = habits.reduce((sum, habit) => {
    const status = habit.log?.status ?? "missed";

    return sum + habit.weight * HABIT_STATUS_WEIGHTS[status];
  }, 0);

  return Math.round((completedWeight / totalWeight) * 100);
}
