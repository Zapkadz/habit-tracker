import {
  Activity,
  CalendarCheck,
  Medal,
  Moon,
  TrendingDown,
} from "lucide-react";
import type { getMonthlyBalance } from "@/server/monthly-balance";
import { formatDuration } from "@/lib/dates/time-utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type MonthlyBalance = Awaited<ReturnType<typeof getMonthlyBalance>>;

type MonthlySummaryCardsProps = {
  review: MonthlyBalance;
};

export function MonthlySummaryCards({ review }: MonthlySummaryCardsProps) {
  const { stats } = review;
  const cards = [
    {
      label: "Completion",
      value: `${stats.completionPercent}%`,
      caption: `${stats.elapsedDayCount}/${stats.totalDayCount} elapsed days`,
      icon: CalendarCheck,
      className: "border-blue-100 bg-blue-50 text-blue-950",
    },
    {
      label: "Tracked Days",
      value: `${stats.trackedDayCount}`,
      caption: "Complete scoring days",
      icon: Activity,
      className: "border-slate-200 bg-white text-slate-950",
    },
    {
      label: "Best Streak",
      value: `${stats.bestStreak}d`,
      caption: "Days at 60%+ habit completion",
      icon: Medal,
      className: "border-emerald-100 bg-emerald-50 text-emerald-950",
    },
    {
      label: "Avg Sleep",
      value:
        stats.sleepDayCount > 0 ? formatDuration(stats.averageSleepMinutes) : "--",
      caption: `${stats.sleepDayCount} logged nights`,
      icon: Moon,
      className: "border-amber-100 bg-amber-50 text-amber-950",
    },
    {
      label: "Weak Habits",
      value: `${stats.weakHabitCount}`,
      caption: "Under 50% monthly completion",
      icon: TrendingDown,
      className: "border-rose-100 bg-rose-50 text-rose-950",
    },
  ] as const;

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card
            key={card.label}
            size="sm"
            className={`rounded-lg border shadow-sm ring-0 ${card.className}`}
          >
            <CardHeader>
              <CardDescription className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-current/60">
                <Icon className="size-3.5" aria-hidden="true" />
                {card.label}
              </CardDescription>
              <CardTitle className="text-2xl font-semibold">
                {card.value}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs leading-5 text-current/65">
                {card.caption}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
