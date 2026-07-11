import { FlameKindling } from "lucide-react";
import type { getMotivationSummary } from "@/server/motivation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type MotivationSummary = Awaited<ReturnType<typeof getMotivationSummary>>;

type SoftStreakCardProps = {
  motivation: MotivationSummary;
};

export function SoftStreakCard({ motivation }: SoftStreakCardProps) {
  const streak = motivation.softStreak;

  return (
    <Card className="rounded-lg border border-slate-200 bg-white shadow-sm ring-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <FlameKindling className="size-4" aria-hidden="true" />
          Soft Streak
        </CardTitle>
        <CardDescription>
          Consistency without harsh resets for imperfect days.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xl font-semibold text-slate-950">
              {streak.goodDays}
            </p>
            <p className="mt-1 text-xs text-slate-500">Good days</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xl font-semibold text-slate-950">
              {streak.currentStreak}
            </p>
            <p className="mt-1 text-xs text-slate-500">Current</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xl font-semibold text-slate-950">
              {streak.bestStreak}
            </p>
            <p className="mt-1 text-xs text-slate-500">Best</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="text-slate-500">30-day consistency</span>
            <span className="font-medium text-slate-950">
              {streak.consistencyPercent}%
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-slate-900"
              style={{ width: `${Math.min(streak.consistencyPercent, 100)}%` }}
            />
          </div>
        </div>

        <p className="text-sm leading-6 text-slate-600">{streak.message}</p>
      </CardContent>
    </Card>
  );
}
