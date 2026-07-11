import Link from "next/link";
import { BatteryCharging, Brain, CalendarRange, Moon } from "lucide-react";
import type { getWeeklyBalance } from "@/server/weekly-balance";
import { Badge } from "@/components/ui/badge";
import { DAY_TYPE_LABELS } from "@/lib/constants/day-types";
import type { WarningLevel } from "@/lib/constants/warnings";
import { formatDuration } from "@/lib/dates/time-utils";

type WeeklyBalance = Awaited<ReturnType<typeof getWeeklyBalance>>;

type WeeklyDayOverviewProps = {
  days: WeeklyBalance["days"];
};

const warningTone: Record<WarningLevel, string> = {
  good: "border-emerald-200 bg-emerald-50 text-emerald-900",
  notice: "border-blue-200 bg-blue-50 text-blue-900",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
  risk: "border-rose-200 bg-rose-50 text-rose-900",
};

const warningLabel: Record<WarningLevel, string> = {
  good: "Good",
  notice: "Notice",
  warning: "Warning",
  risk: "Risk",
};

function MetricLine({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Moon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2 text-xs text-slate-600">
      <span className="flex items-center gap-1.5">
        <Icon className="size-3.5 text-slate-400" aria-hidden="true" />
        {label}
      </span>
      <span className="font-medium text-slate-950">{value}</span>
    </div>
  );
}

export function WeeklyDayOverview({ days }: WeeklyDayOverviewProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-base font-semibold text-slate-950">
            <CalendarRange className="size-4" aria-hidden="true" />
            7-Day Overview
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Daily score and workload signals reused from the Today page.
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-7">
        {days.map((day) => (
          <Link
            key={day.date}
            href={`/today?date=${day.date}`}
            className={`rounded-lg border p-3 transition-colors hover:border-slate-400 ${
              day.hasData
                ? "border-slate-200 bg-white"
                : "border-dashed border-slate-200 bg-slate-50"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-slate-950">
                  {day.weekdayLabel}
                </p>
                <p className="text-xs text-slate-500">{day.shortDateLabel}</p>
              </div>
              <Badge
                variant="outline"
                className={`rounded-lg ${warningTone[day.score.warningLevel]}`}
              >
                {day.hasData ? warningLabel[day.score.warningLevel] : "Empty"}
              </Badge>
            </div>

            <div className="mt-4">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Daily score
              </p>
              <p className="mt-1 text-3xl font-semibold text-slate-950">
                {day.hasData ? day.score.totalScore : "--"}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {DAY_TYPE_LABELS[day.dayType]}
              </p>
            </div>

            <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
              <MetricLine
                icon={Moon}
                label="Sleep"
                value={formatDuration(day.score.metrics.sleepMinutes)}
              />
              <MetricLine
                icon={Brain}
                label="Focus"
                value={formatDuration(day.score.metrics.focusMinutes)}
              />
              <MetricLine
                icon={BatteryCharging}
                label="Rest"
                value={formatDuration(day.score.metrics.restMinutes)}
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
