import { CalendarClock } from "lucide-react";
import type { getMotivationSummary } from "@/server/motivation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type MotivationSummary = Awaited<ReturnType<typeof getMotivationSummary>>;

type ChallengeConceptCardProps = {
  motivation: MotivationSummary;
};

export function ChallengeConceptCard({
  motivation,
}: ChallengeConceptCardProps) {
  const trackedDays = motivation.analytics.summary.trackedDayCount;
  const progressPercent = Math.min(Math.round((trackedDays / 90) * 100), 100);

  return (
    <Card className="rounded-lg border border-slate-200 bg-white shadow-sm ring-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <CalendarClock className="size-4" aria-hidden="true" />
          90-Day Challenge Concept
        </CardTitle>
        <CardDescription>
          A future campaign mode, kept lightweight for the MVP.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-slate-600">Recent logged base</span>
          <span className="font-medium text-slate-950">
            {trackedDays}/90 days
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-slate-900"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-sm leading-6 text-slate-600">
          Later this can become a focused campaign such as Japan Work
          Preparation, with weekly missions and recovery rules.
        </p>
      </CardContent>
    </Card>
  );
}
