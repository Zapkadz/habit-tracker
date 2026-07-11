import { Trophy } from "lucide-react";
import type { getMotivationSummary } from "@/server/motivation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type MotivationSummary = Awaited<ReturnType<typeof getMotivationSummary>>;

type RoutineRankCardProps = {
  motivation: MotivationSummary;
};

export function RoutineRankCard({ motivation }: RoutineRankCardProps) {
  const rank = motivation.rank;

  return (
    <Card className="rounded-lg border border-slate-200 bg-white shadow-sm ring-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Trophy className="size-4" aria-hidden="true" />
          Routine Rank
        </CardTitle>
        <CardDescription>
          A 30-day seriousness signal from score, habits, sleep, and risk.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end gap-3">
          <span
            className={
              rank.key.length > 2
                ? "text-4xl font-semibold leading-none text-slate-950"
                : "text-6xl font-semibold leading-none text-slate-950"
            }
          >
            {rank.key}
          </span>
          <div className="pb-1">
            <p className="text-lg font-semibold text-slate-950">{rank.label}</p>
            <p className="text-sm text-slate-500">{rank.score}/100 points</p>
          </div>
        </div>

        <p className="text-sm leading-6 text-slate-600">{rank.description}</p>
        <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium leading-6 text-slate-700">
          {rank.nextTarget}
        </p>
      </CardContent>
    </Card>
  );
}
