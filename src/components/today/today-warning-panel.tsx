import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import type { DailyBalanceResult, DailyWarning } from "@/lib/scoring/types";
import type { WarningLevel } from "@/lib/constants/warnings";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type TodayWarningPanelProps = {
  score: DailyBalanceResult;
};

const levelTone: Record<WarningLevel, string> = {
  good: "border-emerald-200 bg-emerald-50 text-emerald-950",
  notice: "border-blue-200 bg-blue-50 text-blue-950",
  warning: "border-amber-200 bg-amber-50 text-amber-950",
  risk: "border-rose-200 bg-rose-50 text-rose-950",
};

const levelLabel: Record<WarningLevel, string> = {
  good: "Good",
  notice: "Notice",
  warning: "Warning",
  risk: "Risk",
};

function WarningIcon({ level }: { level: WarningLevel }) {
  if (level === "good") {
    return <CheckCircle2 className="size-4" aria-hidden="true" />;
  }

  if (level === "notice") {
    return <Info className="size-4" aria-hidden="true" />;
  }

  return <AlertTriangle className="size-4" aria-hidden="true" />;
}

function WarningItem({ warning }: { warning: DailyWarning }) {
  return (
    <div
      className={`rounded-lg border px-3 py-2 ${levelTone[warning.level]}`}
    >
      <div className="flex items-start gap-2">
        <WarningIcon level={warning.level} />
        <div>
          <p className="text-sm font-semibold">{warning.title}</p>
          <p className="mt-1 text-sm leading-6 text-current/75">
            {warning.message}
          </p>
        </div>
      </div>
    </div>
  );
}

export function TodayWarningPanel({ score }: TodayWarningPanelProps) {
  return (
    <Card className="rounded-lg border border-slate-200 bg-white shadow-sm ring-0">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <AlertTriangle className="size-4" aria-hidden="true" />
              Warnings and Advice
            </CardTitle>
            <CardDescription>
              Supportive rule-based signals, not a judgment.
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className={`rounded-lg ${levelTone[score.warningLevel]}`}
          >
            {levelLabel[score.warningLevel]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {score.warnings.length > 0 ? (
          score.warnings.map((warning) => (
            <WarningItem key={warning.id} warning={warning} />
          ))
        ) : (
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-600">
            No major warning yet. Add more sleep, rest, focus, and check-in data
            to make the advice sharper.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
