import { Grid3X3 } from "lucide-react";
import type { getMonthlyBalance } from "@/server/monthly-balance";
import { HABIT_CATEGORY_LABELS, type HabitStatus } from "@/lib/constants/habits";
import { Badge } from "@/components/ui/badge";

type MonthlyBalance = Awaited<ReturnType<typeof getMonthlyBalance>>;

type MonthlyHabitGridProps = {
  review: MonthlyBalance;
};

const statusTone: Record<HabitStatus, string> = {
  done: "border-emerald-300 bg-emerald-500",
  partial: "border-blue-300 bg-blue-400",
  skipped: "border-slate-300 bg-slate-300",
  missed: "border-rose-300 bg-rose-400",
};

function getStatusTitle(status: HabitStatus | null) {
  if (!status) {
    return "No log";
  }

  return status;
}

export function MonthlyHabitGrid({ review }: MonthlyHabitGridProps) {
  const gridTemplateColumns = `minmax(180px,1.5fr) repeat(${review.days.length},24px) 68px`;

  return (
    <section className="min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm [contain:layout_paint]">
      <div className="border-b border-slate-100 px-4 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-base font-semibold text-slate-950">
              <Grid3X3 className="size-4" aria-hidden="true" />
              Monthly Habit Grid
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Compact review of each habit across the selected month.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className="rounded-lg border-emerald-200 bg-emerald-50 text-emerald-900"
            >
              Done
            </Badge>
            <Badge
              variant="outline"
              className="rounded-lg border-blue-200 bg-blue-50 text-blue-900"
            >
              Partial
            </Badge>
            <Badge
              variant="outline"
              className="rounded-lg border-rose-200 bg-rose-50 text-rose-900"
            >
              Missed
            </Badge>
          </div>
        </div>
      </div>

      {review.habits.length === 0 ? (
        <div className="p-8 text-center">
          <Grid3X3 className="mx-auto size-8 text-slate-400" aria-hidden="true" />
          <p className="mt-3 text-sm font-semibold text-slate-950">
            No habits to review
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Create or activate habits first, then log them from Today.
          </p>
        </div>
      ) : (
        <div className="max-w-full overflow-x-auto [contain:layout_paint]">
          <div className="w-max min-w-full p-4">
            <div
              className="grid items-center gap-1 text-xs"
              style={{ gridTemplateColumns }}
            >
              <div className="sticky left-0 z-10 bg-white pb-2 font-medium text-slate-500">
                Habit
              </div>
              {review.days.map((day) => (
                <div
                  key={day.date}
                  className="pb-2 text-center text-[0.7rem] font-medium text-slate-500"
                  title={day.date}
                >
                  <div>{day.dayOfMonth}</div>
                  <div className="text-[0.65rem] text-slate-400">
                    {day.weekdayLabel}
                  </div>
                </div>
              ))}
              <div className="pb-2 text-right font-medium text-slate-500">
                Rate
              </div>

              {review.habits.map((habit) => (
                <div key={habit.id} className="contents">
                  <div className="sticky left-0 z-10 min-w-0 bg-white py-2 pr-3">
                    <p className="truncate text-sm font-medium text-slate-950">
                      {habit.name}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {HABIT_CATEGORY_LABELS[habit.category]} - weight{" "}
                      {habit.weight} - target {habit.targetPerWeek}/week
                    </p>
                  </div>
                  {review.days.map((day) => {
                    const status = habit.statuses[day.date];

                    return (
                      <div
                        key={`${habit.id}-${day.date}`}
                        className={`size-5 rounded border ${
                          status
                            ? statusTone[status]
                            : day.isFuture
                              ? "border-slate-100 bg-slate-50"
                              : "border-slate-200 bg-white"
                        }`}
                        title={`${day.date}: ${getStatusTitle(status)}`}
                      >
                        <span className="sr-only">
                          {day.date} {getStatusTitle(status)}
                        </span>
                      </div>
                    );
                  })}
                  <div className="py-2 text-right text-sm font-semibold text-slate-950">
                    {habit.completionPercent}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
