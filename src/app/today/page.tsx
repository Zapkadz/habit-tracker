import { CalendarDays, Gauge, ListChecks, Target } from "lucide-react";
import { IdentityReminderCard } from "@/components/motivation/identity-reminder-card";
import { RecoveryMessageCard } from "@/components/motivation/recovery-message-card";
import { DailyCheckinForm } from "@/components/today/daily-checkin-form";
import { PriorityList } from "@/components/today/priority-list";
import { TimeBlockTimeline } from "@/components/today/time-block-timeline";
import { TodayAnalysisPanel } from "@/components/today/today-analysis-panel";
import { TodayHabitChecklist } from "@/components/today/today-habit-checklist";
import { TodayScoreCard } from "@/components/today/today-score-card";
import { TodayWarningPanel } from "@/components/today/today-warning-panel";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DAY_TYPE_LABELS } from "@/lib/constants/day-types";
import { MAX_DAILY_PRIORITIES } from "@/lib/constants/planner";
import {
  formatReadableDate,
  parseDateString,
} from "@/lib/dates/date-utils";
import { formatDuration, minutesBetween } from "@/lib/dates/time-utils";
import { calculateDailyBalance } from "@/lib/scoring/daily-score";
import { getDailyCheckin } from "@/server/daily-checkins";
import { getDailyPriorities } from "@/server/daily-priorities";
import { getHabitChecklist } from "@/server/habit-logs";
import { getMotivationSummary } from "@/server/motivation";
import { getTimeBlocks } from "@/server/time-blocks";

type TodayPageProps = {
  searchParams?: Promise<{
    date?: string;
    notice?: string;
    error?: string;
  }>;
};

export default async function TodayPage({ searchParams }: TodayPageProps) {
  const params = searchParams ? await searchParams : {};
  const selectedDate = parseDateString(params.date);
  const [habits, checkin, priorities, timeBlocks, motivation] = await Promise.all([
    getHabitChecklist(selectedDate),
    getDailyCheckin(selectedDate),
    getDailyPriorities(selectedDate),
    getTimeBlocks(selectedDate),
    getMotivationSummary(selectedDate),
  ]);
  const plannedMinutes = timeBlocks.reduce(
    (sum, block) =>
      sum + minutesBetween(block.plannedStartTime, block.plannedEndTime),
    0
  );
  const dayType = checkin?.dayType ?? "normal";
  const score = calculateDailyBalance({
    dayType,
    checkin,
    habits,
    priorities,
    timeBlocks,
  });

  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-slate-200 bg-white px-5 py-5 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Today Command Center
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950 sm:text-3xl">
              Plan and track {formatReadableDate(selectedDate)}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Plan priorities, schedule time blocks, log active habits, and
              capture the daily check-in from one screen.
            </p>
          </div>

          <form className="flex flex-wrap items-end gap-2" action="/today">
            <div className="space-y-1">
              <label
                htmlFor="today-date"
                className="text-xs font-medium text-slate-500"
              >
                Date
              </label>
              <Input
                id="today-date"
                type="date"
                name="date"
                defaultValue={selectedDate}
                className="w-40 bg-white"
              />
            </div>
            <Button type="submit" variant="outline" size="lg">
              Open date
            </Button>
          </form>
        </div>
      </section>

      {params.notice ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900">
          {params.notice}
        </div>
      ) : null}
      {params.error ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-900">
          {params.error}
        </div>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Card
          size="sm"
          className="rounded-lg border border-blue-100 bg-blue-50 text-blue-950 shadow-sm ring-0"
        >
          <CardHeader>
            <CardDescription className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-current/60">
              <CalendarDays className="size-3.5" aria-hidden="true" />
              Day type
            </CardDescription>
            <CardTitle className="text-2xl font-semibold">
              {DAY_TYPE_LABELS[dayType]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs leading-5 text-current/65">
              Saved through the daily check-in.
            </p>
          </CardContent>
        </Card>

        <Card
          size="sm"
          className="rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-950 shadow-sm ring-0"
        >
          <CardHeader>
            <CardDescription className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-current/60">
              <ListChecks className="size-3.5" aria-hidden="true" />
              Active habits
            </CardDescription>
            <CardTitle className="text-2xl font-semibold">
              {habits.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs leading-5 text-current/65">
              Status is saved per selected date.
            </p>
          </CardContent>
        </Card>

        <Card
          size="sm"
          className="rounded-lg border border-amber-100 bg-amber-50 text-amber-950 shadow-sm ring-0"
        >
          <CardHeader>
            <CardDescription className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-current/60">
              <Target className="size-3.5" aria-hidden="true" />
              Priorities
            </CardDescription>
            <CardTitle className="text-2xl font-semibold">
              {priorities.length} / {MAX_DAILY_PRIORITIES}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs leading-5 text-current/65">
              Top outcomes for the day.
            </p>
          </CardContent>
        </Card>

        <Card
          size="sm"
          className="rounded-lg border border-slate-200 bg-white text-slate-950 shadow-sm ring-0"
        >
          <CardHeader>
            <CardDescription className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-current/60">
              <Gauge className="size-3.5" aria-hidden="true" />
              Daily score
            </CardDescription>
            <CardTitle className="text-2xl font-semibold">
              {score.dataStatus.isComplete ? score.totalScore : "--"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs leading-5 text-current/65">
              {score.scoreLabel} - {formatDuration(plannedMinutes)} planned.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.85fr)]">
        <div className="space-y-4">
          <PriorityList date={selectedDate} priorities={priorities} />
          <TimeBlockTimeline date={selectedDate} timeBlocks={timeBlocks} />
          <TodayHabitChecklist date={selectedDate} habits={habits} />
        </div>

        <div className="space-y-4">
          <IdentityReminderCard motivation={motivation} />
          <RecoveryMessageCard motivation={motivation} />
          <TodayScoreCard score={score} />
          <DailyCheckinForm date={selectedDate} checkin={checkin} />
          <TodayAnalysisPanel score={score} />
          <TodayWarningPanel score={score} />
        </div>
      </section>
    </div>
  );
}
