import type { getDailyCheckin } from "@/server/daily-checkins";
import { upsertDailyCheckin } from "@/server/daily-checkins";
import { DAY_TYPE_LABELS } from "@/lib/constants/day-types";
import { DayTypeSelector } from "@/components/today/day-type-selector";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PendingSubmitButton } from "@/components/ui/pending-submit-button";
import { NOTE_MAX_LENGTH } from "@/lib/validation/text";

type DailyCheckin = Awaited<ReturnType<typeof getDailyCheckin>>;

type DailyCheckinFormProps = {
  date: string;
  checkin: DailyCheckin;
};

function ratingLabel(value: string) {
  return `${value}/10`;
}

export function DailyCheckinForm({ date, checkin }: DailyCheckinFormProps) {
  const dayType = checkin?.dayType ?? "normal";

  return (
    <Card className="rounded-lg border border-slate-200 bg-white shadow-sm ring-0">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Daily Check-in
        </CardTitle>
        <CardDescription>
          {DAY_TYPE_LABELS[dayType]} day settings and personal context.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={upsertDailyCheckin} className="space-y-4">
          <input name="date" type="hidden" value={date} />

          <div className="space-y-2">
            <Label htmlFor="day-type">Day type</Label>
            <DayTypeSelector defaultValue={dayType} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sleep-start">Sleep start</Label>
              <Input
                id="sleep-start"
                name="sleepStart"
                type="time"
                defaultValue={checkin?.sleepStart ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wake-time">Wake time</Label>
              <Input
                id="wake-time"
                name="wakeTime"
                type="time"
                defaultValue={checkin?.wakeTime ?? ""}
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="mood">Mood</Label>
              <Input
                id="mood"
                name="mood"
                type="number"
                min={1}
                max={10}
                placeholder={ratingLabel("7")}
                defaultValue={checkin?.mood ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="motivation">Motivation</Label>
              <Input
                id="motivation"
                name="motivation"
                type="number"
                min={1}
                max={10}
                placeholder={ratingLabel("7")}
                defaultValue={checkin?.motivation ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stress">Stress</Label>
              <Input
                id="stress"
                name="stress"
                type="number"
                min={1}
                max={10}
                placeholder={ratingLabel("4")}
                defaultValue={checkin?.stress ?? ""}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="checkin-note">Note</Label>
            <textarea
              id="checkin-note"
              name="note"
              rows={4}
              maxLength={NOTE_MAX_LENGTH}
              defaultValue={checkin?.note ?? ""}
              placeholder="Short context for today..."
              className="min-h-24 w-full rounded-lg border border-input bg-white px-2.5 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>

          <PendingSubmitButton size="lg" className="w-full sm:w-auto">
            Save check-in
          </PendingSubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}
