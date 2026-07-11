import { TrendingDown } from "lucide-react";
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

type WeakHabitsProps = {
  habits: MonthlyBalance["weakHabits"];
};

export function WeakHabits({ habits }: WeakHabitsProps) {
  return (
    <Card className="rounded-lg border border-slate-200 bg-white shadow-sm ring-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <TrendingDown className="size-4" aria-hidden="true" />
          Weak Habits
        </CardTitle>
        <CardDescription>
          Habits that may need smaller targets or better placement.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {habits.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
            No weak habit signal yet.
          </p>
        ) : (
          habits.map((habit) => (
            <div
              key={habit.id}
              className="rounded-lg border border-slate-200 bg-slate-50 p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-950">
                    {habit.name}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {HABIT_CATEGORY_LABELS[habit.category]} - skipped/missed{" "}
                    {habit.skippedCount + habit.missedCount}
                  </p>
                </div>
                <span className="text-sm font-semibold text-rose-700">
                  {habit.completionPercent}%
                </span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
