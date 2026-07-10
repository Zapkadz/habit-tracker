import { Activity, BatteryCharging, Brain, Clock3, Moon } from "lucide-react";
import type { getDailyCheckin } from "@/server/daily-checkins";
import type { getDailyPriorities } from "@/server/daily-priorities";
import type { getHabitChecklist } from "@/server/habit-logs";
import type { getTimeBlocks } from "@/server/time-blocks";
import {
  FOCUS_CATEGORIES,
  REST_CATEGORIES,
} from "@/lib/constants/planner";
import { formatDuration, minutesBetween } from "@/lib/dates/time-utils";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type DailyCheckin = Awaited<ReturnType<typeof getDailyCheckin>>;
type DailyPriority = Awaited<ReturnType<typeof getDailyPriorities>>[number];
type ChecklistHabit = Awaited<ReturnType<typeof getHabitChecklist>>[number];
type TimeBlock = Awaited<ReturnType<typeof getTimeBlocks>>[number];

type TodayAnalysisPanelProps = {
  checkin: DailyCheckin;
  priorities: DailyPriority[];
  habits: ChecklistHabit[];
  timeBlocks: TimeBlock[];
};

const focusCategories = new Set<string>(FOCUS_CATEGORIES);
const restCategories = new Set<string>(REST_CATEGORIES);

function blockPlannedMinutes(block: TimeBlock) {
  return minutesBetween(block.plannedStartTime, block.plannedEndTime);
}

function blockUsefulMinutes(block: TimeBlock) {
  if (block.status === "skipped") {
    return 0;
  }

  return block.actualDurationMinutes ?? blockPlannedMinutes(block);
}

function workloadLabel(focusMinutes: number) {
  if (focusMinutes >= 8 * 60) {
    return "Heavy";
  }

  if (focusMinutes >= 3 * 60) {
    return "Balanced";
  }

  return "Light";
}

function habitCompletion(habits: ChecklistHabit[]) {
  const totalWeight = habits.reduce((sum, habit) => sum + habit.weight, 0);

  if (totalWeight === 0) {
    return 0;
  }

  const completedWeight = habits.reduce((sum, habit) => {
    if (habit.log?.status === "done") {
      return sum + habit.weight;
    }

    if (habit.log?.status === "partial") {
      return sum + habit.weight * 0.5;
    }

    return sum;
  }, 0);

  return Math.round((completedWeight / totalWeight) * 100);
}

export function TodayAnalysisPanel({
  checkin,
  priorities,
  habits,
  timeBlocks,
}: TodayAnalysisPanelProps) {
  const plannedMinutes = timeBlocks.reduce(
    (sum, block) => sum + blockPlannedMinutes(block),
    0
  );
  const sleepBlockMinutes = timeBlocks
    .filter((block) => block.category === "sleep")
    .reduce((sum, block) => sum + blockUsefulMinutes(block), 0);
  const checkinSleepMinutes =
    checkin?.sleepStart && checkin?.wakeTime
      ? minutesBetween(checkin.sleepStart, checkin.wakeTime)
      : 0;
  const sleepMinutes = sleepBlockMinutes || checkinSleepMinutes;
  const focusMinutes = timeBlocks
    .filter((block) => focusCategories.has(block.category))
    .reduce((sum, block) => sum + blockUsefulMinutes(block), 0);
  const restMinutes = timeBlocks
    .filter((block) => restCategories.has(block.category))
    .reduce((sum, block) => sum + blockUsefulMinutes(block), 0);
  const donePriorities = priorities.filter(
    (priority) => priority.status === "done"
  ).length;
  const doneBlocks = timeBlocks.filter((block) => block.status === "done")
    .length;
  const skippedBlocks = timeBlocks.filter((block) => block.status === "skipped")
    .length;
  const completion = habitCompletion(habits);

  return (
    <Card className="rounded-lg border border-slate-200 bg-white shadow-sm ring-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Activity className="size-4" aria-hidden="true" />
          Today Analysis
        </CardTitle>
        <CardDescription>
          Basic totals only. Full scoring and warnings start in Phase 4.
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
              {formatDuration(sleepMinutes)}
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-500">
              <Brain className="size-3.5" aria-hidden="true" />
              Focus
            </p>
            <p className="mt-2 text-xl font-semibold text-slate-950">
              {formatDuration(focusMinutes)}
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-500">
              <BatteryCharging className="size-3.5" aria-hidden="true" />
              Rest
            </p>
            <p className="mt-2 text-xl font-semibold text-slate-950">
              {formatDuration(restMinutes)}
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-500">
              <Clock3 className="size-3.5" aria-hidden="true" />
              Planned
            </p>
            <p className="mt-2 text-xl font-semibold text-slate-950">
              {formatDuration(plannedMinutes)}
            </p>
          </div>
        </div>

        <div className="space-y-2 rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-600">
          <div className="flex items-center justify-between gap-3">
            <span>Workload level</span>
            <Badge
              variant="outline"
              className="rounded-lg border-slate-300 bg-slate-50 text-slate-700"
            >
              {workloadLabel(focusMinutes)}
            </Badge>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span>Habit completion</span>
            <span className="font-medium text-slate-950">{completion}%</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span>Priority completion</span>
            <span className="font-medium text-slate-950">
              {donePriorities}/{priorities.length}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span>Blocks done/skipped</span>
            <span className="font-medium text-slate-950">
              {doneBlocks}/{skippedBlocks}
            </span>
          </div>
        </div>

        <p className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm leading-6 text-blue-950">
          Keep the plan realistic: if planned time is high but rest is low,
          Phase 4 will turn that into a warning.
        </p>
      </CardContent>
    </Card>
  );
}
