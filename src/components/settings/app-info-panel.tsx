import { Database, Gauge, Info, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DAILY_SCORE_WEIGHTS,
  DEFAULT_FOCUS_TARGET_HOURS,
  DEFAULT_REST_TARGET_MINUTES,
  DEFAULT_SLEEP_TARGET_HOURS,
  SCORE_THRESHOLDS,
} from "@/lib/constants/scoring";

type AppInfoPanelProps = {
  databaseUrl: string;
};

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-slate-600">{label}</span>
      <span className="font-medium text-slate-950">{value}</span>
    </div>
  );
}

export function AppInfoPanel({ databaseUrl }: AppInfoPanelProps) {
  return (
    <Card className="rounded-lg border border-slate-200 bg-white shadow-sm ring-0">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Info className="size-4" aria-hidden="true" />
              App Info
            </CardTitle>
            <CardDescription>
              Local-first settings. These values are read-only for now.
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className="w-fit rounded-lg border-emerald-200 bg-emerald-50 text-emerald-900"
          >
            Local only
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 xl:grid-cols-3">
        <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="flex items-center gap-2 text-sm font-semibold text-slate-950">
            <ShieldCheck className="size-4" aria-hidden="true" />
            MVP constraints
          </p>
          <StatRow label="Authentication" value="None" />
          <StatRow label="Deployment" value="None" />
          <StatRow label="AI features" value="None" />
        </div>

        <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="flex items-center gap-2 text-sm font-semibold text-slate-950">
            <Database className="size-4" aria-hidden="true" />
            Database
          </p>
          <StatRow label="Engine" value="SQLite" />
          <StatRow label="URL" value={databaseUrl} />
          <StatRow label="Scope" value="Personal local data" />
        </div>

        <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="flex items-center gap-2 text-sm font-semibold text-slate-950">
            <Gauge className="size-4" aria-hidden="true" />
            Score defaults
          </p>
          <StatRow
            label="Sleep target"
            value={`${DEFAULT_SLEEP_TARGET_HOURS.min}-${DEFAULT_SLEEP_TARGET_HOURS.max}h`}
          />
          <StatRow
            label="Focus target"
            value={`${DEFAULT_FOCUS_TARGET_HOURS.min}-${DEFAULT_FOCUS_TARGET_HOURS.max}h`}
          />
          <StatRow
            label="Rest target"
            value={`${DEFAULT_REST_TARGET_MINUTES.min}m+`}
          />
          <StatRow
            label="Excellent"
            value={`${SCORE_THRESHOLDS.excellent}+`}
          />
          <StatRow
            label="Weights"
            value={`S${DAILY_SCORE_WEIGHTS.sleep * 100}/F${
              DAILY_SCORE_WEIGHTS.focus * 100
            }/H${DAILY_SCORE_WEIGHTS.habit * 100}`}
          />
        </div>
      </CardContent>
    </Card>
  );
}
