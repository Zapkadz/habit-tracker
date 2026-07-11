import { Activity, BatteryCharging, Brain, Clock3, Moon } from "lucide-react";
import type { DailyBalanceResult } from "@/lib/scoring/types";
import { formatDuration } from "@/lib/dates/time-utils";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type TodayAnalysisPanelProps = {
  score: DailyBalanceResult;
};

function workloadLabel(focusMinutes: number) {
  if (focusMinutes >= 8 * 60) {
    return "Heavy";
  }

  if (focusMinutes >= 3 * 60) {
    return "Balanced";
  }

  return "Light";
}

export function TodayAnalysisPanel({ score }: TodayAnalysisPanelProps) {
  const { metrics } = score;

  return (
    <Card className="rounded-lg border border-slate-200 bg-white shadow-sm ring-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Activity className="size-4" aria-hidden="true" />
          Today Analysis
        </CardTitle>
        <CardDescription>
          Score inputs used for daily balance and warnings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-500">
              <Moon className="size-3.5" aria-hidden="true" />
              Sleep
            </p>
            <p className="mt-2 text-xl font-semibold text-slate-950">
              {formatDuration(metrics.sleepMinutes)}
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-500">
              <Brain className="size-3.5" aria-hidden="true" />
              Focus
            </p>
            <p className="mt-2 text-xl font-semibold text-slate-950">
              {formatDuration(metrics.focusMinutes)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Planned {formatDuration(metrics.plannedFocusMinutes)}
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-500">
              <BatteryCharging className="size-3.5" aria-hidden="true" />
              Rest
            </p>
            <p className="mt-2 text-xl font-semibold text-slate-950">
              {formatDuration(metrics.restMinutes)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Planned {formatDuration(metrics.plannedRestMinutes)}
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-500">
              <Clock3 className="size-3.5" aria-hidden="true" />
              Planned
            </p>
            <p className="mt-2 text-xl font-semibold text-slate-950">
              {formatDuration(metrics.plannedMinutes)}
            </p>
          </div>
        </div>

        <div className="space-y-2 rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-600">
          <div className="flex items-center justify-between gap-3">
            <span>Data status</span>
            <Badge
              variant="outline"
              className="rounded-lg border-slate-300 bg-slate-50 text-slate-700"
            >
              {score.scoreLabel}
            </Badge>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span>Workload level</span>
            <Badge
              variant="outline"
              className="rounded-lg border-slate-300 bg-slate-50 text-slate-700"
            >
              {workloadLabel(metrics.focusMinutes)}
            </Badge>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span>Habit completion</span>
            <span className="font-medium text-slate-950">
              {metrics.habitCompletionPercent}%
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span>Priority completion</span>
            <span className="font-medium text-slate-950">
              {metrics.donePriorityCount}/{metrics.priorityCount}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span>Priority score</span>
            <span className="font-medium text-slate-950">
              {score.scores.priorityScore}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span>Blocks done/skipped</span>
            <span className="font-medium text-slate-950">
              {metrics.completedBlocks}/{metrics.skippedBlocks}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
