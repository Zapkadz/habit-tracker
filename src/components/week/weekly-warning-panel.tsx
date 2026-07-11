import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import type { getWeeklyBalance } from "@/server/weekly-balance";
import type { WarningLevel } from "@/lib/constants/warnings";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type WeeklyBalance = Awaited<ReturnType<typeof getWeeklyBalance>>;
type WeeklyWarning = WeeklyBalance["warnings"][number];

type WeeklyWarningPanelProps = {
  balance: WeeklyBalance;
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

function WarningItem({ warning }: { warning: WeeklyWarning }) {
  return (
    <div className={`rounded-lg border px-3 py-2 ${levelTone[warning.level]}`}>
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

export function WeeklyWarningPanel({ balance }: WeeklyWarningPanelProps) {
  const { summary } = balance;

  return (
    <Card className="rounded-lg border border-slate-200 bg-white shadow-sm ring-0">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <AlertTriangle className="size-4" aria-hidden="true" />
              Weekly Warnings
            </CardTitle>
            <CardDescription>
              Balance signals across workload, sleep, rest, and goal pace.
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className={`rounded-lg ${levelTone[balance.warningLevel]}`}
          >
            {levelLabel[balance.warningLevel]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {balance.warnings.map((warning) => (
          <WarningItem key={warning.id} warning={warning} />
        ))}

        <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-600">
          <p className="font-medium text-slate-950">Recovery candidate</p>
          <p className="mt-1">
            {summary.suggestedRecoveryLabel
              ? `${summary.suggestedRecoveryLabel} is the lightest candidate based on current planned focus.`
              : "Add a few planned days to make a recovery suggestion."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
