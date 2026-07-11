import { BatteryCharging } from "lucide-react";
import type { getMotivationSummary } from "@/server/motivation";
import type { WarningLevel } from "@/lib/constants/warnings";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type MotivationSummary = Awaited<ReturnType<typeof getMotivationSummary>>;

type RecoveryMessageCardProps = {
  motivation: MotivationSummary;
};

const levelTone: Record<WarningLevel, string> = {
  good: "border-emerald-200 bg-emerald-50 text-emerald-950",
  notice: "border-blue-200 bg-blue-50 text-blue-950",
  warning: "border-amber-200 bg-amber-50 text-amber-950",
  risk: "border-rose-200 bg-rose-50 text-rose-950",
};

export function RecoveryMessageCard({
  motivation,
}: RecoveryMessageCardProps) {
  const recovery = motivation.recovery;

  return (
    <Card className={`rounded-lg border shadow-sm ring-0 ${levelTone[recovery.level]}`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <BatteryCharging className="size-4" aria-hidden="true" />
              Recovery Signal
            </CardTitle>
            <CardDescription className="text-current/65">
              Supportive guidance from recent sleep, stress, focus, and rest.
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className="rounded-lg border-current/20 bg-white/60 text-current"
          >
            {recovery.level}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-sm font-semibold">{recovery.title}</p>
          <p className="mt-1 text-sm leading-6 text-current/75">
            {recovery.message}
          </p>
        </div>
        <p className="rounded-lg border border-current/10 bg-white/70 px-3 py-2 text-sm font-medium leading-6 text-current/80">
          {recovery.action}
        </p>
      </CardContent>
    </Card>
  );
}
