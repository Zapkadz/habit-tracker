import { Compass } from "lucide-react";
import type { getMotivationSummary } from "@/server/motivation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type MotivationSummary = Awaited<ReturnType<typeof getMotivationSummary>>;

type IdentityReminderCardProps = {
  motivation: MotivationSummary;
};

export function IdentityReminderCard({
  motivation,
}: IdentityReminderCardProps) {
  return (
    <Card className="rounded-lg border border-slate-200 bg-white shadow-sm ring-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Compass className="size-4" aria-hidden="true" />
          Identity Reminder
        </CardTitle>
        <CardDescription>
          A serious reminder matched to recent routine signals.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium leading-6 text-slate-800">
          {motivation.recovery.identityReminder}
        </p>
      </CardContent>
    </Card>
  );
}
