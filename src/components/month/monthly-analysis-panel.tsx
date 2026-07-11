import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import type { getMonthlyBalance } from "@/server/monthly-balance";
import type { WarningLevel } from "@/lib/constants/warnings";
import { formatDuration } from "@/lib/dates/time-utils";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type MonthlyBalance = Awaited<ReturnType<typeof getMonthlyBalance>>;
type MonthlyWarning = MonthlyBalance["warnings"][number];

type MonthlyAnalysisPanelProps = {
  review: MonthlyBalance;
};

const levelTone: Record<WarningLevel, string> = {
  good: "border-emerald-200 bg-emerald-50 text-emerald-950",
  notice: "border-blue-200 bg-blue-50 text-blue-950",
  warning: "border-amber-200 bg-amber-50 text-amber-950",
  risk: "border-rose-200 bg-rose-50 text-rose-950",
};

const levelLabel: Record<WarningLevel, string> = {
  good: "Good",
  notice: "Notice",
  warning: "Warning",
  risk: "Risk",
};

const trendLabel = {
  improving: "Improving",
  stable: "Stable",
  declining: "Declining",
} as const;

function WarningIcon({ level }: { level: WarningLevel }) {
  if (level === "good") {
    return <CheckCircle2 className="size-4" aria-hidden="true" />;
  }

  if (level === "notice") {
    return <Info className="size-4" aria-hidden="true" />;
  }

  return <AlertTriangle className="size-4" aria-hidden="true" />;
}

function WarningItem({ warning }: { warning: MonthlyWarning }) {
  return (
    <div className={`rounded-lg border px-3 py-2 ${levelTone[warning.level]}`}>
      <div className="flex items-start gap-2">
        <WarningIcon level={warning.level} />
        <div>
          <p className="text-sm font-semibold">{warning.title}</p>
          <p className="mt-1 text-sm leading-6 text-current/75">
            {warning.message}
          </p>
        </div>
      </div>
    </div>
  );
}

function valueOrDash(value: number | null) {
  return typeof value === "number" ? value.toFixed(1) : "--";
}

export function MonthlyAnalysisPanel({ review }: MonthlyAnalysisPanelProps) {
  const { stats } = review;

  return (
    <Card className="rounded-lg border border-slate-200 bg-white shadow-sm ring-0">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <AlertTriangle className="size-4" aria-hidden="true" />
              Monthly Summary
            </CardTitle>
            <CardDescription>
              Consistency, recovery, and trend signals for the month.
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className={`rounded-lg ${levelTone[review.warningLevel]}`}
          >
            {levelLabel[review.warningLevel]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Trend
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-950">
              {trendLabel[stats.trendDirection]}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Best day
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-950">
              {stats.bestDay ? stats.bestDay.label : "--"}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Avg mood
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-950">
              {valueOrDash(stats.averageMood)}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Avg stress
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-950">
              {valueOrDash(stats.averageStress)}
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-600">
          <div className="flex items-center justify-between gap-3">
            <span>Average sleep</span>
            <span className="font-medium text-slate-950">
              {stats.sleepDayCount > 0
                ? formatDuration(stats.averageSleepMinutes)
                : "--"}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between gap-3">
            <span>Weak days</span>
            <span className="font-medium text-slate-950">
              {stats.weakDayCount}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between gap-3">
            <span>Skipped or missed logs</span>
            <span className="font-medium text-slate-950">
              {stats.skippedOrMissedCount}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {review.warnings.map((warning) => (
            <WarningItem key={warning.id} warning={warning} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
