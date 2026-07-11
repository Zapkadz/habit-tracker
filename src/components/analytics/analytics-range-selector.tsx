import Link from "next/link";
import { CalendarDays, RotateCcw } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ANALYTICS_RANGE_OPTIONS,
  DEFAULT_ANALYTICS_RANGE_DAYS,
} from "@/lib/dates/range-utils";

type AnalyticsRangeSelectorProps = {
  startDate: string;
  endDate: string;
  presetDays: number | null;
  label: string;
};

export function AnalyticsRangeSelector({
  startDate,
  endDate,
  presetDays,
  label,
}: AnalyticsRangeSelectorProps) {
  return (
    <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Routine Analytics
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950 sm:text-3xl">
          {label}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Study long-range patterns across sleep, focus, rest, mood, habits,
          burnout risk, and planning accuracy.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-2">
        <div className="flex flex-wrap gap-2">
          {ANALYTICS_RANGE_OPTIONS.map((days) => (
            <Link
              key={days}
              href={`/analytics?range=${days}`}
              className={buttonVariants({
                variant: presetDays === days ? "default" : "outline",
                size: "lg",
              })}
            >
              {days}d
            </Link>
          ))}
        </div>

        <form className="flex flex-wrap items-end gap-2" action="/analytics">
          <div className="space-y-1">
            <Label htmlFor="analytics-start" className="text-xs text-slate-500">
              Start
            </Label>
            <Input
              id="analytics-start"
              type="date"
              name="start"
              defaultValue={startDate}
              className="w-40 bg-white"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="analytics-end" className="text-xs text-slate-500">
              End
            </Label>
            <Input
              id="analytics-end"
              type="date"
              name="end"
              defaultValue={endDate}
              className="w-40 bg-white"
            />
          </div>
          <Button type="submit" variant="outline" size="lg">
            <CalendarDays className="size-4" aria-hidden="true" />
            Open
          </Button>
        </form>

        <Link
          href={`/analytics?range=${DEFAULT_ANALYTICS_RANGE_DAYS}`}
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Default
        </Link>
      </div>
    </div>
  );
}
