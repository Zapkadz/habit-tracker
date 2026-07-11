import Link from "next/link";
import { CalendarDays, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  addMonthsToMonthString,
  formatMonthLabel,
  getCurrentMonthString,
} from "@/lib/dates/month-utils";

type MonthSelectorProps = {
  month: string;
};

export function MonthSelector({ month }: MonthSelectorProps) {
  const previousMonth = addMonthsToMonthString(month, -1);
  const nextMonth = addMonthsToMonthString(month, 1);
  const currentMonth = getCurrentMonthString();

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Monthly Habit Dashboard
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950 sm:text-3xl">
          {formatMonthLabel(month)}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Review consistency, sleep, mood, motivation, and habit strength across
          the selected month.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-2">
        <Link
          href={`/month?month=${previousMonth}`}
          className={buttonVariants({ variant: "outline", size: "icon-lg" })}
          title="Previous month"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
        </Link>

        <form className="flex flex-wrap items-end gap-2" action="/month">
          <div className="space-y-1">
            <Label htmlFor="month" className="text-xs text-slate-500">
              Month
            </Label>
            <Input
              id="month"
              type="month"
              name="month"
              defaultValue={month}
              className="w-40 bg-white"
            />
          </div>
          <Button type="submit" variant="outline" size="lg">
            <CalendarDays className="size-4" aria-hidden="true" />
            Open
          </Button>
        </form>

        <Link
          href={`/month?month=${currentMonth}`}
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Current
        </Link>

        <Link
          href={`/month?month=${nextMonth}`}
          className={buttonVariants({ variant: "outline", size: "icon-lg" })}
          title="Next month"
        >
          <ChevronRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
