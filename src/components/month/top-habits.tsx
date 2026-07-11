import { Medal } from "lucide-react";
import type { getMonthlyBalance } from "@/server/monthly-balance";
import { HABIT_CATEGORY_LABELS } from "@/lib/constants/habits";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type MonthlyBalance = Awaited<ReturnType<typeof getMonthlyBalance>>;

type TopHabitsProps = {
  habits: MonthlyBalance["topHabits"];
};

export function TopHabits({ habits }: TopHabitsProps) {
  return (
    <Card className="rounded-lg border border-slate-200 bg-white shadow-sm ring-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Medal className="size-4" aria-hidden="true" />
          Top Habits
        </CardTitle>
        <CardDescription>
          Strongest habits by monthly completion rate.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {habits.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
            No completed habits yet.
          </p>
        ) : (
          habits.map((habit) => (
            <div key={habit.id} className="space-y-1.5">
              <div className="flex items-center justify-between gap-3 text-sm">
                <div>
                  <p className="font-medium text-slate-950">{habit.name}</p>
                  <p className="text-xs text-slate-500">
                    {HABIT_CATEGORY_LABELS[habit.category]} - best streak{" "}
                    {habit.bestStreak}d
                  </p>
                </div>
                <span className="font-semibold text-slate-950">
                  {habit.completionPercent}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-emerald-600"
                  style={{ width: `${Math.min(habit.completionPercent, 100)}%` }}
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
