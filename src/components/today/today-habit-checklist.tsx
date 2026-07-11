import { RotateCcw } from "lucide-react";
import type { getHabitChecklist } from "@/server/habit-logs";
import {
  clearHabitLog,
  updateHabitLogStatus,
} from "@/server/habit-logs";
import {
  HABIT_CATEGORY_LABELS,
  HABIT_STATUS_LABELS,
  HABIT_STATUSES,
  type HabitCategory,
  type HabitStatus,
} from "@/lib/constants/habits";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PendingSubmitButton } from "@/components/ui/pending-submit-button";
import { cn } from "@/lib/utils";

type ChecklistHabit = Awaited<ReturnType<typeof getHabitChecklist>>[number];

type TodayHabitChecklistProps = {
  date: string;
  habits: ChecklistHabit[];
};

const statusTone: Record<HabitStatus, string> = {
  done: "border-emerald-200 bg-emerald-50 text-emerald-900",
  partial: "border-blue-200 bg-blue-50 text-blue-900",
  skipped: "border-slate-200 bg-slate-50 text-slate-700",
  missed: "border-rose-200 bg-rose-50 text-rose-900",
};

function categoryLabel(category: HabitCategory) {
  return HABIT_CATEGORY_LABELS[category] ?? category;
}

function completionPercentage(habits: ChecklistHabit[]) {
  const scoredHabits = habits.filter(
    (habit) => habit.log && habit.log.status !== "skipped"
  );
  const activeWeight = scoredHabits.reduce((sum, habit) => sum + habit.weight, 0);

  if (activeWeight === 0) {
    return 0;
  }

  const completedWeight = scoredHabits.reduce((sum, habit) => {
    if (habit.log?.status === "done") {
      return sum + habit.weight;
    }

    if (habit.log?.status === "partial") {
      return sum + habit.weight * 0.5;
    }

    return sum;
  }, 0);

  return Math.round((completedWeight / activeWeight) * 100);
}

export function TodayHabitChecklist({
  date,
  habits,
}: TodayHabitChecklistProps) {
  const completedCount = habits.filter((habit) => habit.log?.status === "done")
    .length;
  const percent = completionPercentage(habits);

  return (
    <Card className="rounded-lg border border-slate-200 bg-white shadow-sm ring-0">
      <CardHeader className="border-b border-slate-100">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-base font-semibold">
              Today&apos;s Habit Checklist
            </CardTitle>
            <CardDescription>
              Active habits for the selected date. Status changes are saved to
              SQLite. Skipped is neutral; missed counts as zero.
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className="w-fit rounded-lg border-slate-300 bg-slate-50 text-slate-700"
          >
            {completedCount}/{habits.length} done - {percent}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {habits.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
            <p className="text-sm font-medium text-slate-950">
              No active habits
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Activate or create habits on the Habits page to see them here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {habits.map((habit) => {
              const currentStatus = habit.log?.status ?? null;

              return (
                <div
                  key={habit.id}
                  className="grid gap-3 py-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-slate-950">
                        {habit.name}
                      </p>
                      <Badge
                        variant="outline"
                        className="rounded-lg border-slate-200 bg-slate-50 text-slate-600"
                      >
                        {categoryLabel(habit.category)}
                      </Badge>
                      <span className="text-xs text-slate-500">
                        weight {habit.weight}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      Target: {habit.targetPerWeek}/week - Icon: {habit.icon}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {HABIT_STATUSES.map((status) => (
                      <form key={status} action={updateHabitLogStatus}>
                        <input name="habitId" type="hidden" value={habit.id} />
                        <input name="date" type="hidden" value={date} />
                        <input name="status" type="hidden" value={status} />
                        <PendingSubmitButton
                          variant="outline"
                          size="sm"
                          className={cn(
                            "border-slate-200 bg-white",
                            currentStatus === status && statusTone[status]
                          )}
                          pendingLabel="..."
                        >
                          {HABIT_STATUS_LABELS[status]}
                        </PendingSubmitButton>
                      </form>
                    ))}
                    {currentStatus ? (
                      <form action={clearHabitLog}>
                        <input name="habitId" type="hidden" value={habit.id} />
                        <input name="date" type="hidden" value={date} />
                        <PendingSubmitButton
                          variant="ghost"
                          size="icon-sm"
                          title="Clear log"
                          pendingLabel="..."
                        >
                          <RotateCcw className="size-4" aria-hidden="true" />
                        </PendingSubmitButton>
                      </form>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
