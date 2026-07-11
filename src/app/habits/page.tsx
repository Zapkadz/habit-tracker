import { Activity, Archive, ListChecks, Plus, Weight } from "lucide-react";
import { HabitForm } from "@/components/habits/habit-form";
import { HabitList } from "@/components/habits/habit-list";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getHabits } from "@/server/habits";

type HabitsPageProps = {
  searchParams?: Promise<{
    notice?: string;
    error?: string;
  }>;
};

export default async function HabitsPage({ searchParams }: HabitsPageProps) {
  const habits = await getHabits();
  const params = searchParams ? await searchParams : {};
  const activeCount = habits.filter((habit) => habit.isActive).length;
  const totalWeight = habits.reduce(
    (sum, habit) => sum + (habit.isActive ? habit.weight : 0),
    0
  );
  const averageTarget =
    habits.length > 0
      ? habits.reduce((sum, habit) => sum + habit.targetPerWeek, 0) /
        habits.length
      : 0;

  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-slate-200 bg-white px-5 py-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Habit Management
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950 sm:text-3xl">
              Manage recurring habits
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Create, edit, deactivate, delete, and tune habits before they
              appear in the daily checklist.
            </p>
          </div>
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
              <ListChecks className="size-3.5" aria-hidden="true" />
              Total habits
            </CardDescription>
            <CardTitle className="text-2xl font-semibold">
              {habits.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs leading-5 text-current/65">
              Includes active and inactive habits.
            </p>
          </CardContent>
        </Card>

        <Card
          size="sm"
          className="rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-950 shadow-sm ring-0"
        >
          <CardHeader>
            <CardDescription className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-current/60">
              <Activity className="size-3.5" aria-hidden="true" />
              Active habits
            </CardDescription>
            <CardTitle className="text-2xl font-semibold">
              {activeCount}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs leading-5 text-current/65">
              Only active habits show on Today.
            </p>
          </CardContent>
        </Card>

        <Card
          size="sm"
          className="rounded-lg border border-amber-100 bg-amber-50 text-amber-950 shadow-sm ring-0"
        >
          <CardHeader>
            <CardDescription className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-current/60">
              <Weight className="size-3.5" aria-hidden="true" />
              Active weight
            </CardDescription>
            <CardTitle className="text-2xl font-semibold">
              {totalWeight}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs leading-5 text-current/65">
              Higher weight means higher future habit score impact.
            </p>
          </CardContent>
        </Card>

        <Card
          size="sm"
          className="rounded-lg border border-slate-200 bg-white text-slate-950 shadow-sm ring-0"
        >
          <CardHeader>
            <CardDescription className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-current/60">
              <Archive className="size-3.5" aria-hidden="true" />
              Avg target
            </CardDescription>
            <CardTitle className="text-2xl font-semibold">
              {averageTarget.toFixed(1)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs leading-5 text-current/65">
              Average target sessions per week.
            </p>
          </CardContent>
        </Card>
      </section>

      <Card className="rounded-lg border border-slate-200 bg-white shadow-sm ring-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Plus className="size-4" aria-hidden="true" />
            Create habit
          </CardTitle>
          <CardDescription>
            Keep weights honest: critical habits like sleep should matter more
            than small maintenance habits.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <HabitForm />
        </CardContent>
      </Card>

      <HabitList habits={habits} />
    </div>
  );
}
