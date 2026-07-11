import {
  AlertTriangle,
  BatteryCharging,
  Brain,
  Gauge,
  Moon,
} from "lucide-react";
import type { getWeeklyBalance } from "@/server/weekly-balance";
import { formatDuration } from "@/lib/dates/time-utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type WeeklyBalance = Awaited<ReturnType<typeof getWeeklyBalance>>;

type WeeklySummaryCardsProps = {
  balance: WeeklyBalance;
};

export function WeeklySummaryCards({ balance }: WeeklySummaryCardsProps) {
  const { summary } = balance;
  const cards = [
    {
      label: "Week Score",
      value: summary.trackedDayCount > 0 ? `${summary.weekScore}` : "--",
      caption: `${summary.trackedDayCount}/7 tracked days`,
      icon: Gauge,
      className: "border-blue-100 bg-blue-50 text-blue-950",
    },
    {
      label: "Average Sleep",
      value:
        summary.sleepDayCount > 0
          ? formatDuration(summary.averageSleepMinutes)
          : "--",
      caption: `${summary.sleepDayCount} logged nights`,
      icon: Moon,
      className: "border-emerald-100 bg-emerald-50 text-emerald-950",
    },
    {
      label: "Focus Total",
      value: formatDuration(summary.totalFocusMinutes),
      caption: "Study, work, and deep work",
      icon: Brain,
      className: "border-slate-200 bg-white text-slate-950",
    },
    {
      label: "Rest Total",
      value: formatDuration(summary.totalRestMinutes),
      caption: `${summary.recoveryDayCount} recovery signals`,
      icon: BatteryCharging,
      className: "border-amber-100 bg-amber-50 text-amber-950",
    },
    {
      label: "Heavy Days",
      value: `${summary.overloadedDayCount}`,
      caption: "Focus or plan overload",
      icon: AlertTriangle,
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
