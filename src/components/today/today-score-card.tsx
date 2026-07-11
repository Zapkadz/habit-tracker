import { Gauge } from "lucide-react";
import { getCompletionMissingItems } from "@/lib/scoring/completion-copy";
import type { DailyBalanceResult } from "@/lib/scoring/types";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type TodayScoreCardProps = {
  score: DailyBalanceResult;
};

const scoreTone = {
  Excellent: "border-emerald-200 bg-emerald-50 text-emerald-950",
  Good: "border-blue-200 bg-blue-50 text-blue-950",
  Okay: "border-amber-200 bg-amber-50 text-amber-950",
  Warning: "border-orange-200 bg-orange-50 text-orange-950",
  "Burnout Risk": "border-rose-200 bg-rose-50 text-rose-950",
  Incomplete: "border-slate-200 bg-slate-50 text-slate-950",
} as const;

function ScoreLine({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="text-slate-500">{label}</span>
        <span className="font-medium text-slate-950">{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-slate-900"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export function TodayScoreCard({ score }: TodayScoreCardProps) {
  const isComplete = score.dataStatus.isComplete;
  const missingItems = getCompletionMissingItems(score.dataStatus.missingSignals);

  return (
    <Card
      className={`rounded-lg border shadow-sm ring-0 ${
        scoreTone[score.scoreLabel]
      }`}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Gauge className="size-4" aria-hidden="true" />
              Daily Balance Score
            </CardTitle>
            <CardDescription className="text-current/65">
              {isComplete
                ? "Live score from sleep, focus, habits, rest, and mood."
                : "Complete the core signals before trusting the score."}
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className="rounded-lg border-current/20 bg-white/60 text-current"
          >
            {score.scoreLabel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end gap-2">
          <span className="text-5xl font-semibold tracking-normal">
            {isComplete ? score.totalScore : "--"}
          </span>
          <span className="pb-1 text-sm font-medium text-current/65">/100</span>
        </div>

        <div className="grid gap-3 rounded-lg border border-current/10 bg-white/70 p-3">
          <ScoreLine label="Sleep" value={score.scores.sleepScore} />
          <ScoreLine label="Focus" value={score.scores.focusScore} />
          <ScoreLine label="Habits" value={score.scores.habitScore} />
          <ScoreLine label="Rest" value={score.scores.restScore} />
          <ScoreLine label="Mood" value={score.scores.moodScore} />
        </div>

        <p className="rounded-lg border border-current/10 bg-white/70 px-3 py-2 text-sm leading-6 text-current/80">
          {score.advice}
        </p>
        {!isComplete && missingItems.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {missingItems.map((item) => (
              <Badge
                key={item.id}
                variant="outline"
                className="rounded-lg border-current/20 bg-white/60 text-current"
              >
                Missing {item.label}
              </Badge>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
