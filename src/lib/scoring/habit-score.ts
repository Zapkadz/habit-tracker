import { HABIT_STATUS_WEIGHTS } from "@/lib/constants/habits";
import type { ScoringHabit } from "@/lib/scoring/types";

export function calculateHabitScore(habits: ScoringHabit[]) {
  const scoredHabits = habits.filter(
    (habit) => habit.log && habit.log.status !== "skipped"
  );
  const totalWeight = scoredHabits.reduce((sum, habit) => sum + habit.weight, 0);

  if (totalWeight === 0) {
    return 100;
  }

  const completedWeight = scoredHabits.reduce(
    (sum, habit) => sum + habit.weight * HABIT_STATUS_WEIGHTS[habit.log!.status],
    0
  );

  return Math.round((completedWeight / totalWeight) * 100);
}
