import { Target } from "lucide-react";
import type { getMotivationSummary } from "@/server/motivation";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type MotivationSummary = Awaited<ReturnType<typeof getMotivationSummary>>;

type WeeklyMissionCardProps = {
  motivation: MotivationSummary;
};

export function WeeklyMissionCard({ motivation }: WeeklyMissionCardProps) {
  const missions = motivation.weeklyMissions;

  return (
    <Card className="rounded-lg border border-slate-200 bg-white shadow-sm ring-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Target className="size-4" aria-hidden="true" />
          Weekly Mission
        </CardTitle>
        <CardDescription>
          Serious goals for the week, using existing Weekly Goals.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {missions.length > 0 ? (
          missions.slice(0, 4).map((mission) => (
            <div key={mission.id} className="space-y-1.5">
              <div className="flex items-center justify-between gap-3 text-sm">
                <div>
                  <p className="font-medium text-slate-950">{mission.title}</p>
                  <p className="text-xs text-slate-500">
                    {mission.currentValue} / {mission.targetValue} {mission.unit}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={`rounded-lg ${
                    mission.isBehind
                      ? "border-amber-200 bg-amber-50 text-amber-900"
                      : "border-emerald-200 bg-emerald-50 text-emerald-900"
                  }`}
                >
                  {mission.progressPercent}%
                </Badge>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${
                    mission.isBehind ? "bg-amber-500" : "bg-slate-900"
                  }`}
                  style={{
                    width: `${Math.min(mission.progressPercent, 100)}%`,
                  }}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="space-y-2">
            {motivation.missionSuggestions.map((suggestion) => (
              <p
                key={suggestion}
                className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-600"
              >
                {suggestion}
              </p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
