import Link from "next/link";
import { CalendarDays, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  addWeeksToDateString,
  formatWeekRange,
  getWeekStartDateString,
} from "@/lib/dates/week-utils";

type WeekSelectorProps = {
  weekStartDate: string;
};

export function WeekSelector({ weekStartDate }: WeekSelectorProps) {
  const previousWeekStart = addWeeksToDateString(weekStartDate, -1);
  const nextWeekStart = addWeeksToDateString(weekStartDate, 1);
  const currentWeekStart = getWeekStartDateString();

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Weekly Balance
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950 sm:text-3xl">
          {formatWeekRange(weekStartDate)}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Review sleep, focus, rest, daily score, goals, and recovery coverage
          across the selected week.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-2">
        <Link
          href={`/week?weekStart=${previousWeekStart}`}
          className={buttonVariants({ variant: "outline", size: "icon-lg" })}
          title="Previous week"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
        </Link>

        <form className="flex flex-wrap items-end gap-2" action="/week">
          <div className="space-y-1">
            <Label htmlFor="week-start" className="text-xs text-slate-500">
              Week of
            </Label>
            <Input
              id="week-start"
              type="date"
              name="weekStart"
              defaultValue={weekStartDate}
              className="w-40 bg-white"
            />
          </div>
          <Button type="submit" variant="outline" size="lg">
            <CalendarDays className="size-4" aria-hidden="true" />
            Open
          </Button>
        </form>

        <Link
          href={`/week?weekStart=${currentWeekStart}`}
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Current
        </Link>

        <Link
          href={`/week?weekStart=${nextWeekStart}`}
          className={buttonVariants({ variant: "outline", size: "icon-lg" })}
          title="Next week"
        >
          <ChevronRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
