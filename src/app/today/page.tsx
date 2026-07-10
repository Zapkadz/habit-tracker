import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ListChecks,
  Target,
} from "lucide-react";
import { TodayHabitChecklist } from "@/components/today/today-habit-checklist";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getHabitChecklist } from "@/server/habit-logs";
import {
  formatReadableDate,
  parseDateString,
} from "@/lib/dates/date-utils";

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
  const habits = await getHabitChecklist(selectedDate);

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
              Phase 2 adds the real habit checklist. Time blocks, priorities,
              check-in, scoring, and warnings remain staged for later phases.
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
            <CardTitle className="text-2xl font-semibold">Normal</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs leading-5 text-current/65">
              Selector arrives with the full Today page.
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
              Managed from the Habits page.
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
            <CardTitle className="text-2xl font-semibold">0 / 3</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs leading-5 text-current/65">
              Priority CRUD arrives in Phase 3.
            </p>
          </CardContent>
        </Card>

        <Card
          size="sm"
          className="rounded-lg border border-slate-200 bg-white text-slate-950 shadow-sm ring-0"
        >
          <CardHeader>
            <CardDescription className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-current/60">
              <CheckCircle2 className="size-3.5" aria-hidden="true" />
              Daily score
            </CardDescription>
            <CardTitle className="text-2xl font-semibold">--</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs leading-5 text-current/65">
              Rule-based scoring starts in Phase 4.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(340px,0.8fr)]">
        <TodayHabitChecklist date={selectedDate} habits={habits} />

        <div className="space-y-4">
          <Card className="rounded-lg border border-slate-200 bg-white shadow-sm ring-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Clock3 className="size-4" aria-hidden="true" />
                Timeline
              </CardTitle>
              <CardDescription>
                TimeBlock CRUD is planned for Phase 3.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                Planned and actual blocks will appear here.
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-lg border border-slate-200 bg-white shadow-sm ring-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <AlertTriangle className="size-4" aria-hidden="true" />
                Warnings and advice
              </CardTitle>
              <CardDescription>
                Warnings become active after scoring is implemented.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Badge
                variant="outline"
                className="rounded-lg border-slate-300 bg-slate-50 text-slate-600"
              >
                Waiting for Phase 4
              </Badge>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
