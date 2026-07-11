import { ArrowRight, CheckCircle2, CircleDashed } from "lucide-react";
import type { DailyBalanceResult } from "@/lib/scoring/types";
import {
  getCompletionMessage,
  getCompletionMissingItems,
  getCompletionTitle,
} from "@/lib/scoring/completion-copy";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type DayCompletionPanelProps = {
  score: DailyBalanceResult;
};

export function DayCompletionPanel({ score }: DayCompletionPanelProps) {
  const missingItems = getCompletionMissingItems(score.dataStatus.missingSignals);
  const isComplete = score.dataStatus.isComplete;

  return (
    <Card
      className={
        isComplete
          ? "rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-950 shadow-sm ring-0"
          : "rounded-lg border border-blue-200 bg-blue-50 text-blue-950 shadow-sm ring-0"
      }
    >
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              {isComplete ? (
                <CheckCircle2 className="size-4" aria-hidden="true" />
              ) : (
                <CircleDashed className="size-4" aria-hidden="true" />
              )}
              {getCompletionTitle(score.dataStatus)}
            </CardTitle>
            <CardDescription className="text-current/70">
              {getCompletionMessage(score.dataStatus)}
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className="w-fit rounded-lg border-current/20 bg-white/70 text-current"
          >
            {isComplete ? "Ready for analytics" : `${missingItems.length} missing`}
          </Badge>
        </div>
      </CardHeader>
      {!isComplete ? (
        <CardContent>
          <div className="grid gap-2">
            {missingItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="group flex items-center justify-between gap-3 rounded-lg border border-current/10 bg-white/75 px-3 py-2 text-sm transition-colors hover:bg-white"
              >
                <span>
                  <span className="block font-semibold text-current">
                    {item.label}
                  </span>
                  <span className="block text-current/70">
                    {item.description}
                  </span>
                </span>
                <ArrowRight
                  className="size-4 shrink-0 text-current/50 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>
            ))}
          </div>
        </CardContent>
      ) : null}
    </Card>
  );
}
